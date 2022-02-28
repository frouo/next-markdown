export type NextMdConfig = {
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
   * - if specified, nextmd will pull or clone the repository and look for markdown files at path `pathToContent` in that repo.
   */
  contentGitRemoteUrl?: string;
};

export type YAMLFrontMatter = { [key: string]: any };
