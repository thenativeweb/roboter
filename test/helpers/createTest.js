'use strict';

const fs = require('fs'),
      path = require('path');

const { assert } = require('assertthat'),
      { isolated } = require('isolated'),
      { processenv } = require('processenv'),
      shell = require('shelljs'),
      stripAnsi = require('strip-ansi'),
      stripIndent = require('common-tags/lib/stripIndent');

const getArgsList = require('./getArgsList'),
      getEnv = require('./getEnv'),
      hasPreHook = require('./hasPreHook'),
      runCommand = require('../../lib/runCommand');

const createTest = function ({ task, testCase, directory, roboterPackagePath }) {
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!testCase) {
    throw new Error('Test case is missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!roboterPackagePath) {
    throw new Error('Roboter package path is missing.');
  }

  it(`${testCase.replace(/-/ug, ' ')}.`, async () => {
    try {
      const testDirectory = await isolated();
      const gitDirectory = await isolated();
      const npmCacheDirectory = await isolated();

      shell.cp(
        '-r',
        [
          `${directory}/*`,
          `${directory}/.*`
        ],
        testDirectory
      );

      shell.rm('-rf', path.join(testDirectory, 'expected.js'));

      const gitignoreName = path.join(testDirectory, '.gitignore');
      const gitignore = stripIndent`
          node_modules
        `;

      await fs.promises.writeFile(gitignoreName, gitignore, { encoding: 'utf8' });

      await runCommand(`npm install --no-package-lock --silent --cache=${npmCacheDirectory}`, { cwd: testDirectory, silent: true });
      await runCommand(`npm install ${roboterPackagePath} --no-package-lock --cache=${npmCacheDirectory}`, { cwd: testDirectory, silent: true });

      await runCommand('git init', { cwd: testDirectory, silent: true });
      await runCommand('git config user.name "Sophie van Sky"', { cwd: testDirectory, silent: true });
      await runCommand('git config user.email "hello@thenativeweb.io"', { cwd: testDirectory, silent: true });
      await runCommand('git add .', { cwd: testDirectory, silent: true });
      await runCommand('git commit -m "Initial commit."', { cwd: testDirectory, silent: true });

      await runCommand('git init --bare', { cwd: gitDirectory, silent: true });
      await runCommand(`git remote add origin ${gitDirectory}`, { cwd: testDirectory, silent: true });
      await runCommand('git push origin master', { cwd: testDirectory, silent: true });

      if (await hasPreHook({ directory: testDirectory })) {
        await runCommand('node pre.js', { cwd: testDirectory });
      }

      const roboterCmd = [
        'npx',
        'roboter',
        task === 'default' ? [] : [ task ],
        getArgsList({ directory: testDirectory })
      ].flat();
      const env = {
        ...processenv(),
        ...getEnv({ directory: testDirectory })
      };
      const roboter = await new Promise(resolve => {
        shell.exec(roboterCmd.join(' '), { cwd: testDirectory, env, silent: true }, (code, stdout, stderr) => {
          resolve({ code, stdout, stderr });
        });
      });

      const stderr = stripAnsi(roboter.stderr),
            stdout = stripAnsi(roboter.stdout);

      /* eslint-disable global-require */
      const expected = require(path.join(directory, 'expected.js'));
      /* eslint-enable global-require */

      if (roboter.code !== expected.exitCode) {
        /* eslint-disable no-console */
        console.log({
          stdout,
          stderr,
          exitCode: { actual: roboter.code, expected: expected.exitCode }
        });
        /* eslint-enable no-console */
      }

      const expectedStderrs = [ expected.stderr ].flat();

      let previousIndex = -1;

      for (const expectedStderr of expectedStderrs) {
        assert.that(stderr).is.containing(expectedStderr);

        const currentIndex = stderr.indexOf(expectedStderr);

        assert.that(currentIndex).is.greaterThan(previousIndex);

        previousIndex = currentIndex;
      }

      assert.that(roboter.code).is.equalTo(expected.exitCode);

      const expectedStdouts = [ expected.stdout ].flat();

      previousIndex = -1;

      for (const expectedStdout of expectedStdouts) {
        assert.that(stdout).is.containing(expectedStdout);

        const currentIndex = stdout.indexOf(expectedStdout);

        assert.that(currentIndex).is.greaterThan(previousIndex);

        previousIndex = currentIndex;
      }

      if (typeof expected.validate !== 'function') {
        return;
      }

      await expected.validate({
        directory: testDirectory,
        repository: gitDirectory,
        exitCode: roboter.code,
        stdout,
        stderr
      });

      shell.rm('-rf', testDirectory);
      shell.rm('-rf', gitDirectory);
      shell.rm('-rf', npmCacheDirectory);
    } catch (ex) {
      /* eslint-disable no-console */
      console.log({ ex });
      /* eslint-enable no-console */
      throw ex;
    }
  });
};

module.exports = createTest;
