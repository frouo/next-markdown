// -----------
// Types
// -----------

import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { PluggableList } from 'unified';

export type MarkdownPlugins = {
  /**
   * Pass a list of remark plugins which will be used to process the markdown.
   */
  remarkPlugins?: PluggableList;

  /**
   * Pass a list of rehype plugins which will be used to process the markdown.
   */
  rehypePlugins?: PluggableList;
};

export type Config = MarkdownPlugins & {
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
  include?: <T extends YAMLFrontMatter = {}>(file: File, frontMatter: T) => boolean;

  /**
   * Get more logs. Make sure it is `false` for production.
   */
  debug?: boolean;
};

export type YAMLFrontMatter = { [key: string]: any };

export type Dir = {
  type: 'dir';
  name: string;
  path: string;
  children: TreeObject[];
};

export type File = {
  type: 'file';
  name: string;
  path: string;
};

export type TreeObject = Dir | File;

export interface TableOfContentItem {
  text: string;
  id: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  subItems: TableOfContentItem[];
}

export type TableOfContents = TableOfContentItem[];

export type NextMarkdownProps<T extends YAMLFrontMatter = {}, U extends YAMLFrontMatter = {}> = NextMarkdownFile<T> & {
  html: string | null;
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>> | null;
  tableOfContents: TableOfContents;
  files: NextMarkdownFile<U>[] | null;
};

export type NextMarkdownFile<U extends YAMLFrontMatter = {}> = {
  nextmd: string[];
  frontMatter: U;
  markdown: string;
};
