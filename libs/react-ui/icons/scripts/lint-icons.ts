#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

import { exec } from 'child_process';
import { debug as debugModule } from 'debug';
import * as gitChangedFiles from 'git-changed-files';

const DEBUG = false; // Alternatively set DEBUG env variable.
const debugScope = '@drewk/react-ui-icons:lint';
const debug = debugModule(debugScope);

if (DEBUG) {
  debugModule.enable(debugScope);
}

const execAsync = (cmd: string): Promise<void> =>
  new Promise((res, rej) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return rej(error);
      }

      console.log(stdout);
      console.log(stderr);
      return res();
    });
  });

(async () => {
  const iconPath = 'libs/react-ui/icons/src/lib';
  const generateCmd = 'yarn react-ui-icons:generate';
  const gitAddCmd = `git add ${iconPath}`;

  debug(`Generating icon components via the command: ${generateCmd}`);
  await execAsync(generateCmd);

  debug(`Staging any uncommitted icon changes via the command: ${gitAddCmd}`);
  await execAsync(gitAddCmd);

  const changedFiles: string[] =
    (await gitChangedFiles()).unCommittedFiles || [];
  changedFiles.forEach((file) => {
    debug(`Found changed Git file: ${file}`);
    if (file.includes(iconPath)) {
      console.error(
        `Detected uncommitted changes in @drewk/react-ui/icons. Please run yarn react-ui-icons:generate and commit the changes`
      );
      process.exit(1);
    }
  });
})();
