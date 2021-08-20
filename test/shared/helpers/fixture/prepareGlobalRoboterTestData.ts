import { buntstift } from 'buntstift';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GlobalRoboterTestData } from './GlobalRoboterTestData';
import { globbySync } from 'globby';
import normalize from 'normalize-path';
import os from 'os';
import path from 'path';
import shelljs from 'shelljs';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const prepareGlobalRoboterTestData = async function (): Promise<GlobalRoboterTestData> {
  const absoluteRoboterProjectDirectory = path.join(dirname, '..', '..', '..', '..');

  const { code: tscCode, stderr: tscStderr } = shelljs.exec(`npx tsc`, { cwd: absoluteRoboterProjectDirectory });

  if (tscCode !== 0) {
    buntstift.error('Failed to build roboter.');

    throw new Error(tscStderr);
  }

  // eslint-disable-next-line no-sync
  const absoluteRoboterPackageDestinationDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'roboter-'));
  // eslint-disable-next-line no-sync
  const absoluteNpmCacheDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'npm-cache-'));

  const { code: packCode, stderr: packStderr } = shelljs.exec(`npm pack "${absoluteRoboterProjectDirectory}"`, { cwd: absoluteRoboterPackageDestinationDirectory });

  if (packCode !== 0) {
    buntstift.error('Failed to pack roboter package.');

    throw new Error(packStderr);
  }

  const absoluteRoboterPackageFile = globbySync([
    path.posix.join(normalize(absoluteRoboterPackageDestinationDirectory), 'roboter*')
  ])[0].replaceAll('/', path.sep);

  return {
    absoluteNpmCacheDirectory,
    absoluteRoboterPackageFile
  };
};

export {
  prepareGlobalRoboterTestData
};
