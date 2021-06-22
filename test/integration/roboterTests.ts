import { buntstift } from 'buntstift';
import { createTest } from '../shared/helpers/createTest.js';
import { fileURLToPath } from 'url';
import fs from 'fs';
import globby from 'globby';
import path from 'path';
import { shallTestCaseBeExecuted } from '../shared/helpers/shallTestCaseBeExecuted.js';
import shelljs from 'shelljs';
import * as os from 'os';

const dirname = path.dirname(fileURLToPath(import.meta.url));

suite('roboter', function (): void {
  this.timeout(3_600_000);

  const absoluteRoboterProjectDirectory = path.join(dirname, '..', '..');

  const { code: tscCode, stderr: tscStderr } = shelljs.exec(`npx tsc`, { cwd: absoluteRoboterProjectDirectory });

  if (tscCode !== 0) {
    buntstift.error('Failed to build roboter.');
    buntstift.error(tscStderr);

    return;
  }

  // eslint-disable-next-line no-sync
  const absoluteRoboterPackageDestinationDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'roboter-'));
  // eslint-disable-next-line no-sync
  const absoluteNpmCacheDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-cache-'));

  shelljs.mkdir(absoluteRoboterPackageDestinationDirectory);
  const { code: packCode, stderr: packStderr } = shelljs.exec(`npm pack ${absoluteRoboterProjectDirectory}`, { cwd: absoluteRoboterPackageDestinationDirectory });

  if (packCode !== 0) {
    buntstift.error('Failed to pack roboter package.');
    buntstift.error(packStderr);

    return;
  }

  const absoluteRoboterPackageFile = globby.sync([ path.join(absoluteRoboterPackageDestinationDirectory, 'roboter*') ])[0];

  const absoluteProjectsDirectory = path.join(dirname, '..', 'shared', 'projects');

  teardown(async (): Promise<void> => {
    await fs.promises.rmdir(absoluteNpmCacheDirectory, { recursive: true });
  });

  // eslint-disable-next-line no-sync
  fs.readdirSync(absoluteProjectsDirectory).forEach((task): void => {
    const taskDirectory = path.join(absoluteProjectsDirectory, task);

    // eslint-disable-next-line no-sync
    if (!fs.statSync(taskDirectory).isDirectory()) {
      return;
    }

    suite(task, (): void => {
      // eslint-disable-next-line no-sync
      fs.readdirSync(taskDirectory).forEach((testCase): void => {
        const absoluteTestCaseDirectory = path.join(taskDirectory, testCase);

        // eslint-disable-next-line no-sync
        if (!fs.statSync(absoluteTestCaseDirectory).isDirectory()) {
          return;
        }

        if (!shallTestCaseBeExecuted({
          task,
          testCase
        })) {
          return;
        }

        createTest({
          task,
          testCase,
          absoluteTestCaseDirectory,
          absoluteNpmCacheDirectory,
          absoluteRoboterPackageFile
        });
      });
    });
  });
});
