import { exec } from 'child_process';
import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';

/**
 * @param config The config for the next-markdown module.
 * @returns The next markdown module ready-to-use.
 */
const NextMarkdown = <PageFrontMatter extends YAMLFrontMatter, PostPageFrontMatter extends PageFrontMatter>(
  config: Config<PageFrontMatter | PostPageFrontMatter>,
) => {
  type UserFrontMatter = PageFrontMatter | PostPageFrontMatter;

  const includeToApply = async (treeObject: File) =>
    config.include
      ? (async (fn: typeof config.include) => {
          const content = await getContentFromMarkdownFile<UserFrontMatter>(treeObject.path);
          return fn(treeObject, content.frontMatter, content.html);
        })(config.include)
      : treeObject.name !== 'README.md' && treeObject.name.startsWith('_') === false;

  return {
    getStaticPaths: async () => {
      const localRepoPath = getContentPath(config.pathToContent, config.contentGitRepo !== undefined);
      const tree = await treeContentRepo(localRepoPath, config);
      const files = flatFiles(tree);
      const staticContents = await Promise.all(
        generatePathsFromFiles(files, localRepoPath).map(async (e) => ({
          ...e,
          include: await includeToApply(e.treeObject),
        })),
      );

      if (config.debug) {
        consoleLogNextmd('getStaticPaths:', JSON.stringify(staticContents));
      }

      return {
        paths: staticContents
          .filter((e) => e.include)
          .map((e) => ({
            params: {
              nextmd: e.nextmd,
            },
          })),
        fallback: false, // See the "fallback" section below
      };
    },

    getStaticProps: async (context: { params?: { nextmd: string[] } }) => {
      const localRepoPath = getContentPath(config.pathToContent, config.contentGitRepo !== undefined);
      const tree = await treeContentRepo(localRepoPath, config);
      const files = flatFiles(tree);
      const staticContents = generatePathsFromFiles(files, localRepoPath);

      const nextmd = context.params?.nextmd;

      if (nextmd === undefined) {
        throw Error('Could not find params "nextmd". Do you name the file `[...nextmd].tsx` or `[...nextmd].jsx`?');
      }

      const data = staticContents.filter((e) => JSON.stringify(e.nextmd) === JSON.stringify(nextmd));

      if (data.length === 0) {
        throw Error(`Could not find markdown file for path /${nextmd.join('/')}`);
      } else if (data.length > 1) {
        throw Error(`Duplicate page detected ${data.map((e) => e.treeObject.path).join(', ')}`);
      }

      const content = data[0];
      const pageData = await getContentFromMarkdownFile<PageFrontMatter>(content.treeObject.path);

      const postsPageData = await getPostsFromNextmd<PostPageFrontMatter>(files, localRepoPath, nextmd);
      const postsPageDataWithInclude = postsPageData
        ? await Promise.all(postsPageData.map(async (e) => ({ ...e, include: await includeToApply(e.file) })))
        : null;

      return {
        props: {
          ...pageData,
          slug: getSlugFromNextmd(nextmd),
          posts: postsPageDataWithInclude?.filter((e) => e.include).map((e) => e.data) ?? null,
        },
      };
    },
  };
};

// -------
// Utils
// -------

const pathToLocalGitRepo = join(process.cwd(), '.git/next-md/');
const pathToNextmdLastUpdate = join(process.cwd(), '.git/next-md-last-update');
const pathToNextmdBranch = join(process.cwd(), '.git/next-md-branch');

const consoleLogNextmd = (...args: (string | undefined | null)[]) => {
  args.unshift('[nextmd]');
  console.log.apply(this, args); // tslint:disable-line:no-console
};

const getContentPath = (pathToContent: string, remote: boolean) => {
  return remote ? join(pathToLocalGitRepo, pathToContent) : join(process.cwd(), pathToContent);
};

const getPostsFromNextmd = async <T extends YAMLFrontMatter>(
  files: File[],
  localRepoPath: string,
  nextmd: string[],
) => {
  type PostFile = { file: File; date: string };

  const posts = files.reduce<PostFile[]>((prev, curr) => {
    const matches = curr.name.match(/^\d{4}-\d{2}-\d{2}/i);
    if (curr.path.startsWith(join(localRepoPath, nextmd.join('/'))) && matches && matches.length > 0) {
      return prev.concat([{ file: curr, date: matches[0] }]);
    }
    return prev;
  }, []);

  return posts.length === 0
    ? null
    : await Promise.all(
        posts.map(async (e) => {
          const postPageData = await getContentFromMarkdownFile<T>(e.file.path);
          const postNextmd = getNextmdFromFilePath(e.file.path, localRepoPath);
          return {
            file: e.file,
            data: {
              ...postPageData,
              slug: getSlugFromNextmd(postNextmd),
              date: e.date,
            },
          };
        }),
      );
};

const treeContentRepo = async <T extends YAMLFrontMatter>(pathToContent: string, config: Config<T>) => {
  if (config.contentGitRepo) {
    const { remoteUrl, branch } = config.contentGitRepo;
    if (!remoteUrl || !branch) {
      throw Error('[nextmd] You must specify both git remote URL and branch when using `contentGitRepo`');
    }

    /**
     * @returns The number of seconds since the last update of the git remote repo.
     */
    const elapsedSecondsSinceLastUpdate = () => {
      const lastRepoUpdateTxt = fs.readFileSync(pathToNextmdLastUpdate).toString('utf-8').trim();
      const lastUpdateMillis = parseInt(lastRepoUpdateTxt, 10);

      return Date.now() - lastUpdateMillis;
    };

    /**
     *
     * @returns The branche name of the last git clone
     */
    const branchLastUpdate = () => fs.readFileSync(pathToNextmdBranch).toString('utf-8').trim();

    /**
     * Mechanism to avoid pulling the repo when `getStaticPaths` & `getStaticProps` is called.
     *
     * This ensures repo content is the same in `getStaticPaths` & `getStaticProps`.
     */
    const shouldUpdateGitRepo = () => {
      if (fs.existsSync(pathToNextmdLastUpdate) === false || fs.existsSync(pathToNextmdBranch) === false) {
        return 'first time fetch';
      }

      const lastBranch = branchLastUpdate();
      if (lastBranch !== branch) {
        return ['was', lastBranch].join(' ');
      }

      if (elapsedSecondsSinceLastUpdate() > 5 * 60 * 1000) {
        // 5 minutes
        return 'last update was > 5 min ago';
      }

      return null;
    };

    const shouldUpdateGitRepoReason = shouldUpdateGitRepo();
    const logFromGit = [remoteUrl, `(Branch: ${branch})`].filter((e) => e).join(' ');
    if (shouldUpdateGitRepoReason) {
      consoleLogNextmd(
        ['cloning', logFromGit, config.debug ? `- ${shouldUpdateGitRepoReason}` : undefined].filter((e) => e).join(' '),
      );
      fs.rmSync(pathToContent, { recursive: true, force: true });
      await cmd(
        ['git', 'clone', branch ? `-b ${branch}` : undefined, '--depth 1', remoteUrl, pathToContent]
          .filter((e) => e)
          .join(' '),
      );
      fs.writeFileSync(pathToNextmdBranch, await cmd(`git -C ${pathToContent} rev-parse --abbrev-ref HEAD`));
      fs.writeFileSync(pathToNextmdLastUpdate, `${Date.now()}`);
    }

    consoleLogNextmd('creating page from', logFromGit);
  } else {
    consoleLogNextmd('creating page from', pathToContent);
  }

  return treeSync(pathToContent);
};

const cmd = (commandLine: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(commandLine, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
};

const exclude = (object: TreeObject) => {
  if (object.type === 'file' && object.name.endsWith('.md') === false) {
    return true;
  }

  if (object.name === '.git') {
    return true;
  }

  if (object.type === 'dir' && object.children.length === 0) {
    return true;
  }

  return false;
};

const treeSync = (path: string) => {
  const res = fs
    .readdirSync(path)
    .map((e) => ({ name: e, path: join(path, e) }))
    .map(
      (
        (fileSystem: typeof fs) =>
        (e): TreeObject | null => {
          const isDir = fileSystem.lstatSync(e.path).isDirectory();
          if (e.name === '.git') {
            return null; // no need to inspect recursively this
          } else {
            return isDir
              ? { type: 'dir', ...e, children: treeSync(e.path) }
              : {
                  type: 'file',
                  ...e,
                };
          }
        }
      )(fs),
    )
    .flatMap((f) => (f ? [f] : []))
    .filter((e) => exclude(e) === false);

  return res;
};

type Dir = {
  type: 'dir';
  name: string;
  path: string;
  children: TreeObject[];
};

type File = {
  type: 'file';
  name: string;
  path: string;
};

type TreeObject = Dir | File;

const flatFiles = (tree: TreeObject[]): File[] => {
  const flatRecursively = (object: TreeObject): TreeObject[] =>
    object.type === 'dir' ? object.children.flatMap(flatRecursively) : [object];

  return tree.flatMap(flatRecursively) as File[];
};

const generatePathsFromFiles = (files: File[], pathToLocalRepo: string) => {
  return files.map((e) => {
    const nextmd = getNextmdFromFilePath(e.path, pathToLocalRepo);

    return {
      nextmd,
      treeObject: e,
    };
  });
};

const getNextmdFromFilePath = (filePath: string, pathToLocalRepo: string) => {
  return (filePath.endsWith('index.md') ? filePath.replace('index.md', '') : filePath)
    .replace(pathToLocalRepo, '')
    .replace('.md', '')
    .replace(/\/\d{4}-\d{2}-\d{2}(.)/, '/') // replace string starting with "/YYYY-MM-DD-" with "/"
    .split('/')
    .filter((e) => e);
};

const getSlugFromNextmd = (nextmd: string[]) => nextmd.slice(-1).pop() ?? ''; // last element without modifying the original array

const getContentFromMarkdownFile = async <T extends YAMLFrontMatter>(filePath: string) => {
  const rawdata = fs.readFileSync(filePath).toString('utf-8');
  return getPageDataFromMarkdownFileRawData<T>(rawdata);
};

const getPageDataFromMarkdownFileRawData = async <T extends YAMLFrontMatter>(
  rawdata: string,
): Promise<{ frontMatter: T; html: string }> => {
  const { data, content } = matter(rawdata);
  const html = await markdownToHtml(content);

  return {
    frontMatter: data as T,
    html,
  };
};

const markdownToHtml = async (markdown: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeVideos)
    .use(rehypeStringify)
    .process(markdown);

  return String(result);
};

const rehypeVideos = (): ((tree: Root) => void) => {
  return (tree) => {
    visit(tree, 'element', (node: any) => {
      if (node.tagName === 'img' && node.properties && typeof node.properties.src === 'string') {
        const url = node.properties.src;

        if (url.includes('.mov') || url.includes('mp4')) {
          const altData = extractDataFromAlt(node.properties.alt);

          node.tagName = 'video';
          node.properties.width = '100%';
          node.properties.controls = true;

          if (typeof altData === 'string') {
            node.properties.alt = altData;
          } else {
            Object.entries(altData).forEach(([key, value]) => {
              node.properties[key] = value;
            });
          }
        }
      }
    });
  };
};

/**
 * If the alt is a JSON, the JSON key/value will be transfered to `node.properties`.
 *
 * For example, this markdown:
 *
 * ```md
 * ![{"alt":"20211029 - edit bot demo","poster":"https://frouo.com/poster.jpg"}](https://frouo.com/video.mp4)
 * ```
 *
 * will generate:
 *
 * ```html
 * <video src="https://frouo.com/video.mp4" alt="20211029 - edit bot demo" width="100%" controls poster="https://frouo.com/poster.jpg"></video>
 * ```
 */
const extractDataFromAlt = (alt: string) => {
  try {
    return JSON.parse(alt) as { [key: string]: any };
  } catch (error) {
    return alt;
  }
};

export default NextMarkdown;

// -----------
// Types
// -----------

export type Config<T extends YAMLFrontMatter> = {
  /**
   * The place where to find your markdown files and folders.
   *
   * This is mandatory.
   */
  pathToContent: string;

  /**
   * The place where your markdown files are stored.
   *
   * - if empty / undefined, your markdown files are considered to be in your current project at path `pathToContent`.
   * - if specified, nextmd will clone (or pull) the repository and look for markdown files at path `pathToContent` in that repo.
   */
  contentGitRepo?: {
    /**
     * The git repository url.
     */
    remoteUrl: string;
    /**
     * The branch.
     */
    branch: string;
  };

  /**
   * A function that tells `next-markdown` to generate a route for the given file. By default `next-markdown` ignores "README.md" files or files name starting with an underscore (eg. `_draft.md`).
   */
  include?: (file: File, frontMatter: T, html: string) => boolean;

  /**
   * Get more logs. Make sure it is `false` for production.
   */
  debug?: boolean;
};

export type YAMLFrontMatter = { [key: string]: any };
