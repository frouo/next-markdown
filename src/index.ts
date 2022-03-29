import { Config, File, YAMLFrontMatter } from './types.js';
import { flatFiles, generatePathsFromFiles, getContentPath } from './utils/fs.js';
import { treeContentRepo } from './utils/git.js';
import { consoleLogNextmd } from './utils/logger.js';
import { getContentFromMarkdownFile, getPostsFromNextmd, getSlugFromNextmd } from './utils/markdown.js';

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

export * from './types.js';
export default NextMarkdown;
 