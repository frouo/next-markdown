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
