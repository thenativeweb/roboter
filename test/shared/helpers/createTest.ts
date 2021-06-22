import { assert } from 'assertthat';
import fs from 'fs';
import { getArgsList } from './getArgsList.js';
import { getEnv } from './getEnv.js';
import globby from 'globby';
import { hasPreHook } from './hasPreHook.js';
import { isolated } from 'isolated';
import path from 'path';
import { processenv } from 'processenv';
import { runCommand } from '../../lib/utils/runCommand.js';
import shell from 'shelljs';
import stripAnsi from 'strip-ansi';
import { stripIndent } from 'common-tags';

const timer = {
  startTime: 0,
  lastTime: 0,
  start (): void {
    this.startTime = Date.now();
    this.lastTime = this.startTime;
  },
  lap (message: string): void {
    const newTime = Date.now();

    console.log(message, { elapsedSinceLast: newTime - this.lastTime, elapsedSinceStart: newTime - this.startTime });
    this.lastTime = newTime;
  }
};

const createTest = function ({ task, testCase, absoluteTestCaseDirectory, absoluteNpmCacheDirectory, absoluteRoboterPackageFile }: {
  task: string;
  testCase: string;
  absoluteTestCaseDirectory: string;
  absoluteNpmCacheDirectory: string;
  absoluteRoboterPackageFile: string;
}): void {
  test(`${testCase.replace(/-/ug, ' ')}.`, async (): Promise<void> => {
    try {
      timer.start();
      const absoluteTestDirectory = await isolated();

      console.log({ absoluteTestDirectory });
      const absoluteGitDirectory = await isolated();

      shell.cp('-r', `${absoluteTestCaseDirectory}/*`, absoluteTestDirectory);
      if ((await globby([ `${absoluteTestCaseDirectory}/.*` ])).length > 0) {
        shell.cp('-r', `${absoluteTestCaseDirectory}/.*`, absoluteTestDirectory);
      }

      shell.rm('-rf', path.join(absoluteTestDirectory, 'expected.js'));

      const gitignoreName = path.join(absoluteTestDirectory, '.gitignore');
      const gitignore = stripIndent`
          node_modules
        `;

      await fs.promises.writeFile(gitignoreName, gitignore, { encoding: 'utf8' });

      const absolutePackageJsonFile = path.join(absoluteTestDirectory, 'package.json');
      const packageJson = JSON.parse(await fs.promises.readFile(absolutePackageJsonFile, 'utf-8'));

      packageJson.dependencies = {
        ...packageJson.dependencies ?? {},
        roboter: absoluteRoboterPackageFile
      };
      await fs.promises.writeFile(absolutePackageJsonFile, JSON.stringify(packageJson, null, 2), 'utf-8');

      await runCommand(`npm install --no-package-lock --silent --cache=${absoluteNpmCacheDirectory} --prefer-offline`, { cwd: absoluteTestDirectory, silent: true });
      timer.lap('npm install');

      // Await runCommand(`npm install ${absoluteRoboterPackageFile} --no-package-lock --cache=${absoluteNpmCacheDirectory}`, { cwd: absoluteTestDirectory, silent: true });
      // timer.lap('npm install roboter package');

      await runCommand('git init --initial-branch main', { cwd: absoluteTestDirectory, silent: true });
      await runCommand('git config user.name "Sophie van Sky"', { cwd: absoluteTestDirectory, silent: true });
      await runCommand('git config user.email "hello@thenativeweb.io"', { cwd: absoluteTestDirectory, silent: true });
      await runCommand('git add .', { cwd: absoluteTestDirectory, silent: true });
      await runCommand('git commit -m "Initial commit."', { cwd: absoluteTestDirectory, silent: true });
      timer.lap('git main repo');

      await runCommand('git init --bare --initial-branch main', { cwd: absoluteGitDirectory, silent: true });
      await runCommand(`git remote add origin ${absoluteGitDirectory}`, { cwd: absoluteTestDirectory, silent: true });
      await runCommand('git push origin main', { cwd: absoluteTestDirectory, silent: true });
      timer.lap('git remote');

      if (await hasPreHook({ absoluteTestDirectory })) {
        await runCommand('node pre.js', { cwd: absoluteTestDirectory, silent: true });
        timer.lap('pre hook');
      }

      const expectations = await import(path.join(absoluteTestCaseDirectory, 'expected.js'));

      let subCommand: string[] = [];

      if (task !== 'default') {
        subCommand = [ task ];
      }
      if (expectations.subCommand) {
        subCommand = [ expectations.subCommand ];
      }

      const roboterCmd = [
        'npx',
        'roboter',
        subCommand,
        await getArgsList({ absoluteTestDirectory })
      ].flat();
      const env: NodeJS.ProcessEnv = {
        ...processenv(),
        ...await getEnv({ absoluteTestDirectory }),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        NODE_OPTIONS: '--experimental-specifier-resolution=node'
      } as NodeJS.ProcessEnv;
      const roboter = await new Promise<{
        code: number | null;
        stdout: string;
        stderr: string;
      }>((resolve): void => {
        const childProcess = shell.exec(
          roboterCmd.join(' '),
          {
            cwd: absoluteTestDirectory,
            env,
            silent: true,
            async: true
          },
          (code, stdout, stderr): void => {
            resolve({
              code,
              stdout,
              stderr
            });
          }
        );

        if (expectations.whileTheCommandIsRunning) {
          expectations.whileTheCommandIsRunning({ childProcess, absoluteTestDirectory });
        }
      });

      timer.lap('roboter');

      const stderr = stripAnsi(roboter.stderr),
            stdout = stripAnsi(roboter.stdout);

      if (roboter.code !== expectations.exitCode) {
        /* eslint-disable no-console */
        console.log({
          stdout,
          stderr,
          exitCode: { actual: roboter.code, expected: expectations.exitCode }
        });
        /* eslint-enable no-console */
      }

      const expectedStderrs = [ expectations.stderr ].flat();

      let previousIndex = -1;

      for (const expectedStderr of expectedStderrs) {
        assert.that(stderr).is.containing(expectedStderr);

        const currentIndex = stderr.indexOf(expectedStderr);

        assert.that(currentIndex).is.greaterThan(previousIndex);

        previousIndex = currentIndex;
      }

      assert.that(roboter.code).is.equalTo(expectations.exitCode);

      const expectedStdouts: string[] = [ expectations.stdout ].flat();

      let stdoutWithoutPreviousMatches = stdout;

      for (const expectedStdout of expectedStdouts) {
        assert.that(stdout).is.containing(expectedStdout);

        const currentIndex = stdout.indexOf(expectedStdout);

        stdoutWithoutPreviousMatches = stdoutWithoutPreviousMatches.slice(currentIndex + expectedStdout.length);
      }

      if (typeof expectations.validate === 'function') {
        await expectations.validate({
          directory: absoluteTestDirectory,
          repository: absoluteGitDirectory,
          exitCode: roboter.code,
          stdout,
          stderr
        });
      }

      shell.rm('-rf', absoluteTestDirectory);
      shell.rm('-rf', absoluteGitDirectory);
    } catch (ex: unknown) {
      /* eslint-disable no-console */
      console.log({ ex });
      /* eslint-enable no-console */
      throw ex;
    }
  });
};

// eslint-disable-next-line mocha/no-exports
export {
  createTest
};
