import { resolve, parse, relative } from 'path';
import { Config, File, YAMLFrontMatter } from './types';
import { pathToContent, flatFiles, generateNextmd } from './utils/fs';
import { treeContentRepo } from './utils/git';
import { consoleLogNextmd } from './utils/logger';
import { readMarkdownFile } from './utils/markdown';

/**
 * @param config The config for the next-markdown module.
 * @returns The next markdown module ready-to-use.
 */
const NextMarkdown = <PageFrontMatter extends YAMLFrontMatter, PostPageFrontMatter extends PageFrontMatter>(
  config: Config<PageFrontMatter | PostPageFrontMatter>,
) => {
  type UserFrontMatter = PageFrontMatter | PostPageFrontMatter;

  const isContentFetchedFromRemote = config.contentGitRepo !== undefined;
  const finalPathToContent = pathToContent(config.pathToContent, isContentFetchedFromRemote);
  const relativeToAbsolute = (filePath: string) => resolve(finalPathToContent, filePath);
  const absoluteToRelative = (filePath: string) => relative(finalPathToContent, filePath);

  const includeToApply = async (file: File) =>
    config.include
      ? (async (fn: typeof config.include) => {
          const { frontMatter } = await readMarkdownFile<UserFrontMatter>(relativeToAbsolute(file.path), config);
          return fn(file, frontMatter);
        })(config.include)
      : file.name !== 'README.md' && file.name.startsWith('_') === false;

  return {
    getStaticPaths: async () => {
      const tree = await treeContentRepo(relativeToAbsolute('.'), config.debug ?? false, config.contentGitRepo);
      const allFiles = flatFiles(tree);
      const allFilesWithInclude = await Promise.all(
        allFiles.map(async (e) => ({
          ...e,
          include: await includeToApply(e),
        })),
      );
      if (config.debug) {
        consoleLogNextmd('getStaticPaths:', JSON.stringify(allFilesWithInclude));
      }
      const files = allFilesWithInclude.filter((e) => e.include);

      return {
        paths: files.map((e) => ({
          params: {
            nextmd: generateNextmd(absoluteToRelative(e.path)),
          },
        })),
        fallback: false, // See the "fallback" section below
      };
    },

    getStaticProps: async (context: { params?: { nextmd: string[] } }) => {
      const tree = await treeContentRepo(relativeToAbsolute('.'), config.debug ?? false, config.contentGitRepo);
      const allFiles = flatFiles(tree);

      const nextmd = context.params?.nextmd;

      if (nextmd === undefined) {
        throw Error('Could not find params "nextmd". Do you name the file `[...nextmd].tsx` or `[...nextmd].jsx`?');
      }

      const file = allFiles.find(
        (e) => JSON.stringify(nextmd) === JSON.stringify(generateNextmd(absoluteToRelative(e.path))),
      );

      if (file === undefined) {
        throw Error(`Could not find markdown file at path "${nextmd.join('/')}"`);
      }

      const pageData = await readMarkdownFile<PageFrontMatter>(relativeToAbsolute(file.path), config);

      const postsFiles = allFiles
        .filter((e) => e !== file) // remove itself
        .filter((e) => JSON.stringify(nextmd) === JSON.stringify(absoluteToRelative(parse(e.path).dir).split('/'))); // get files in the same directory

      const postsFilesWithInclude = await Promise.all(
        postsFiles.map(async (e) => ({ ...e, include: await includeToApply(e) })),
      );

      const postsPageData = await Promise.all(
        postsFilesWithInclude
          .filter((e) => e.include)
          .map(async (e) => {
            const data = await readMarkdownFile<PostPageFrontMatter>(relativeToAbsolute(e.path), config);
            return {
              ...data,
              nextmd: generateNextmd(absoluteToRelative(e.path)),
            };
          }),
      );

      return {
        props: {
          ...pageData,
          nextmd,
          posts: postsPageData,
        },
      };
    },
  };
};

export default NextMarkdown;
export * from './types';
