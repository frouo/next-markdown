import { resolve, relative } from 'path';
import { Config, File, NextMarkdownFile, NextMarkdownProps, YAMLFrontMatter } from './types';
import { pathToContent, flatFiles, generateNextmd, readFileSyncUTF8, isDraft } from './utils/fs';
import { treeContentRepo } from './utils/git';
import { consoleLogNextmd } from './utils/logger';
import { extractFrontMatter, readMarkdownFile } from './utils/markdown';

/**
 * @param config The config for the next-markdown module.
 * @returns The next markdown module ready-to-use.
 */
const NextMarkdown = <T extends YAMLFrontMatter, U extends YAMLFrontMatter = T>(config: Config) => {
  const isContentFetchedFromRemote = config.contentGitRepo !== undefined;
  const finalPathToContent = pathToContent(config.pathToContent, isContentFetchedFromRemote);
  const relativeToAbsolute = (filePath: string) => resolve(finalPathToContent, filePath);
  const absoluteToRelative = (filePath: string) => relative(finalPathToContent, filePath);

  const getAllFiles = async () => {
    const filterFileFinal = async (file: File) =>
      config.filterFile
        ? (async (fn: typeof config.filterFile) => {
            const rawdata = readFileSyncUTF8(relativeToAbsolute(file.path));
            const { frontMatter } = extractFrontMatter(rawdata);
            return fn(file, frontMatter);
          })(config.filterFile)
        : file.name !== 'README.md';

    const tree = await treeContentRepo(
      relativeToAbsolute('.'),
      absoluteToRelative,
      config.debug ?? false,
      config.contentGitRepo,
    );

    const allFiles = await Promise.all(
      flatFiles(tree).map(async (e) => ({ file: e, isIncluded: await filterFileFinal(e) })),
    );

    if (config.debug) {
      consoleLogNextmd('Files:', JSON.stringify(allFiles));
    }

    return allFiles.filter((e) => e.isIncluded).map((e) => e.file);
  };

  const getStaticPropsForNextmd = async <R extends YAMLFrontMatter, S extends YAMLFrontMatter = R>(
    nextmd: string[],
  ): Promise<{ props: NextMarkdownProps<R, S> }> => {
    const allFiles = await getAllFiles();

    const file = allFiles.find((e) => JSON.stringify(nextmd) === JSON.stringify(generateNextmd(e.path)));

    if (file === undefined) {
      throw Error(`Could not find markdown file at path "${nextmd.join('/')}"`);
    }

    const pageData = await readMarkdownFile<R>(relativeToAbsolute(file.path), config);

    const subPaths = allFiles
      .filter((e) => e !== file) // remove itself
      .filter((e) => isDraft(e.path) === false) // exclude draft or unpublished
      .map((e): NextMarkdownFile<S> | null => {
        // compare file's nextmd with the given nextmd
        const fileNextmd = generateNextmd(e.path);
        const parentNextmd = fileNextmd.slice(0, -1); // remove last element
        if (JSON.stringify(nextmd) === JSON.stringify(parentNextmd)) {
          const { frontMatter, content } = extractFrontMatter<S>(readFileSyncUTF8(relativeToAbsolute(e.path)));
          return {
            nextmd: fileNextmd,
            frontMatter,
            markdown: content,
          };
        } else {
          return null;
        }
      })
      .flatMap((e) => (e ? [e] : []));

    return {
      props: {
        ...pageData,
        nextmd,
        subPaths,
      },
    };
  };

  return {
    getStaticPaths: async () => {
      const allFiles = await getAllFiles();

      return {
        paths: allFiles
          .filter((e) => isDraft(e.path) === false)
          .map((e) => ({
            params: {
              nextmd: generateNextmd(e.path),
            },
          })),
        fallback: false, // See the "fallback" section below
      };
    },

    getStaticProps: async (context: { params?: { nextmd: string[] } }): Promise<{ props: NextMarkdownProps<T, U> }> => {
      const nextmd = context.params?.nextmd;

      return getStaticPropsForNextmd<T, U>(nextmd ?? []);
    },

    getStaticPropsForNextmd,
  };
};

export default NextMarkdown;
export * from './types';
