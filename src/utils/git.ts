import fs from 'fs';

import { Config, YAMLFrontMatter } from '../types';
import { cmd } from './cmd';
import { pathToNextmdBranch, pathToNextmdLastUpdate } from './constants';
import { treeSync } from './fs';
import { consoleLogNextmd } from './logger';

export const treeContentRepo = async <T extends YAMLFrontMatter>(pathToContent: string, config: Config<T>) => {
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
