import fs from 'fs';
import { cmd } from './cmd';
import { treeSync } from './fs';
import { consoleLogNextmd } from './logger';

const pathToNextmdLastUpdate = '.git/next-md-last-update';
const pathToNextmdBranch = '.git/next-md-branch';

type GitRepo = {
  remoteUrl: string;
  branch: string;
};

/**
 * @param pathToContent Absolute path to content
 */
export const treeContentRepo = async (
  pathToContent: string,
  absoluteToRelative: (path: string) => string,
  debug: boolean,
  gitRepo?: GitRepo,
) => {
  if (gitRepo) {
    const { remoteUrl, branch } = gitRepo;
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
        ['cloning', logFromGit, debug ? `- ${shouldUpdateGitRepoReason}` : undefined].filter((e) => e).join(' '),
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

  return treeSync(pathToContent, absoluteToRelative);
};
