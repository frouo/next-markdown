import { exec } from 'child_process';

export const cmd = (commandLine: string) => {
  return new Promise<string>((resolve, reject) => {
    exec(commandLine, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout || stderr);
    });
  });
};
