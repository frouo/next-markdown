import { join } from 'path';

export const pathToLocalGitRepo = join(process.cwd(), '.git/next-md/');
export const pathToNextmdLastUpdate = join(process.cwd(), '.git/next-md-last-update');
export const pathToNextmdBranch = join(process.cwd(), '.git/next-md-branch');
