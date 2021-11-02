import { buntstift } from 'buntstift';
import { fileExists } from '../../../../lib/utils/fileExists';
import { fileURLToPath } from 'url';
import { Fixture } from './Fixture';
import fs from 'fs';
import { globby } from 'globby';
import { isolated } from 'isolated';
import normalize from 'normalize-path';
import path from 'path';
import { runCommand } from '../../../../lib/utils/runCommand';
import shelljs from 'shelljs';
import { stripIndent } from 'common-tags';
import { defekt, error, Result, value } from 'defekt';

const dirname = path.dirname(fileURLToPath(import.meta.url));

class FixtureNotFound extends defekt({ code: 'FixtureNotFound' }) {}

const timer = {
  startTime: 0,
  lastTime: 0,
  start (): void {
    this.startTime = Date.now();
    this.lastTime = this.startTime;
  },
  lap (message: string): void {
    const newTime = Date.now();

    buntstift.verbose(
      `${message} - ${JSON.stringify({ elapsedSinceLast: newTime - this.lastTime, elapsedSinceStart: newTime - this.startTime })}`
    );
    this.lastTime = newTime;
  }
};

const loadFixture = async function ({ fixturePath, absoluteRoboterPackageFile, absoluteNpmCacheDirectory }: {
  fixturePath: string[];
  absoluteRoboterPackageFile: string;
  absoluteNpmCacheDirectory: string;
}): Promise<Result<Fixture, FixtureNotFound>> {
  buntstift.verbose(`Loading fixture ${fixturePath.join('/')}...`);
  const absoluteFixtureDirectory = path.join(dirname, '..', '..', 'fixtures', ...fixturePath);

  if (!await fileExists({ absoluteFile: absoluteFixtureDirectory })) {
    return error(new FixtureNotFound());
  }

  timer.start();
  const absoluteTestDirectory = await isolated();

  buntstift.verbose(`absoluteTestDirectory: ${absoluteTestDirectory}`);

  shelljs.cp('-r', `${absoluteFixtureDirectory}/*`, absoluteTestDirectory);
  if ((await globby([ `${normalize(absoluteFixtureDirectory)}/.*` ])).length > 0) {
    shelljs.cp('-r', `${absoluteFixtureDirectory}/.*`, absoluteTestDirectory);
  }

  shelljs.rm('-rf', path.join(absoluteTestDirectory, 'expected.js'));

  const gitignoreName = path.join(absoluteTestDirectory, '.gitignore');
  const gitignore = stripIndent`
          node_modules
        `;

  await fs.promises.writeFile(gitignoreName, gitignore, { encoding: 'utf8' });

  const absolutePackageJsonFile = path.join(absoluteTestDirectory, 'package.json');
  const packageJson = JSON.parse(await fs.promises.readFile(absolutePackageJsonFile, 'utf-8'));

  packageJson.devDependencies = {
    ...packageJson.devDependencies ?? {},
    roboter: absoluteRoboterPackageFile
  };
  await fs.promises.writeFile(absolutePackageJsonFile, JSON.stringify(packageJson, null, 2), 'utf-8');

  const absoluteNpmPackageJsonLintRcFile = path.join(absoluteTestDirectory, '.npmpackagejsonlintrc.json');
  let npmPackageJsonLintRc: any;

  try {
    npmPackageJsonLintRc = JSON.parse(await fs.promises.readFile(absoluteNpmPackageJsonLintRcFile, 'utf-8'));
  } catch {
    npmPackageJsonLintRc = {
      extends: 'npm-package-json-lint-config-tnw/lib.json'
    };
  }

  npmPackageJsonLintRc.rules = 'rules' in npmPackageJsonLintRc ? npmPackageJsonLintRc.rules : {};
  npmPackageJsonLintRc.rules = { ...npmPackageJsonLintRc.rules, 'no-archive-devDependencies': 'off' };
  await fs.promises.writeFile(absoluteNpmPackageJsonLintRcFile, JSON.stringify(npmPackageJsonLintRc, null, 2), 'utf-8');

  await runCommand(`npm install --no-package-lock --silent --cache=${absoluteNpmCacheDirectory} --prefer-offline`, { cwd: absoluteTestDirectory, silent: true });
  timer.lap('npm install');

  // We might want to add some node modules manually, especially in the license tests.
  if (await fileExists({ absoluteFile: path.join(absoluteFixtureDirectory, 'node_modules') })) {
    shelljs.cp('-r', `${absoluteFixtureDirectory}/node_modules`, absoluteTestDirectory);
  }

  await runCommand('git init --initial-branch main', { cwd: absoluteTestDirectory, silent: true });
  await runCommand('git config user.name "Sophie van Sky"', { cwd: absoluteTestDirectory, silent: true });
  await runCommand('git config user.email "hello@thenativeweb.io"', { cwd: absoluteTestDirectory, silent: true });
  await runCommand('git add .', { cwd: absoluteTestDirectory, silent: true });
  await runCommand('git commit -m "Initial commit."', { cwd: absoluteTestDirectory, silent: true });
  timer.lap('git main repo');

  return value({
    fixturePath,
    absoluteTestDirectory
  });
};

export {
  loadFixture
};
