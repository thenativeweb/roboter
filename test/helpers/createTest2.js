'use strict';

const fs = require('fs'),
      path = require('path');

const { assert } = require('assertthat'),
      { isolated } = require('isolated'),
      { processenv } = require('processenv'),
      shell = require('shelljs'),
      stripAnsi = require('strip-ansi'),
      stripIndent = require('common-tags/lib/stripIndent');

const addPackageDependency = require('./addPackageDependency'),
      getArgsList = require('./getArgsList'),
      getEnv = require('./getEnv'),
      hasPreHook = require('./hasPreHook');

const createTest = function ({ task, testCase, directory }) {
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!testCase) {
    throw new Error('Test case is missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  test(`${testCase.replace(/-/ug, ' ')}.`, async () => {
    const testDirectory = await isolated();
    const gitDirectory = await isolated();

    console.log(`Test directory: ${testDirectory}`);
    console.log(`Git directory: ${gitDirectory}`);

    shell.cp(
      '-r',
      [
        `${directory}/*`,
        `${directory}/.*`
      ],
      testDirectory
    );

    await addPackageDependency({
      directory: testDirectory,
      dependencyName: 'roboter',
      dependencyTarget: path.join(__dirname, '..', '..')
    });

    // We need to explicitly add all the eslint plugins/configs and @types since
    // they must be in the node_modules root directory for eslint respectively
    // typescript to find them.
    for (const packageName of [ 'eslint-config-es', 'eslint-plugin-extended', 'eslint-plugin-mocha', 'eslint-plugin-unicorn', 'eslint-plugin-react' ]) {
      await addPackageDependency({
        directory: testDirectory,
        dependencyName: packageName,
        dependencyTarget: path.join(__dirname, '..', '..', 'node_modules', packageName)
      });
    }
    for (const typescriptEslintPackageName of [ 'eslint-plugin' ]) {
      await addPackageDependency({
        directory: testDirectory,
        dependencyName: `@typescript-eslint/${typescriptEslintPackageName}`,
        dependencyTarget: path.join(__dirname, '..', '..', 'node_modules', '@typescript-eslint', typescriptEslintPackageName)
      });
    }
    for (const typePackage of [ 'mocha' ]) {
      await addPackageDependency({
        directory: testDirectory,
        dependencyName: `@types/${typePackage}`,
        dependencyTarget: path.join(__dirname, '..', '..', 'node_modules', '@types', typePackage)
      });
    }

    shell.exec('npm install --no-package-lock --silent', { cwd: testDirectory });

    shell.exec('git init', { cwd: testDirectory });
    shell.exec('git add .', { cwd: testDirectory });
    shell.exec('git commit -m "Initial commit."', { cwd: testDirectory });

    shell.exec('git init --bare', { cwd: gitDirectory });
    shell.exec(`git remote add origin ${gitDirectory}`, { cwd: testDirectory });
    shell.exec('git push origin master', { cwd: testDirectory });

    if (await hasPreHook({ directory: testDirectory })) {
      shell.exec('node pre.js', { cwd: testDirectory });
    }

    shell.rm('-rf', path.join(testDirectory, 'expected.js'));

    const roboterCmd = [
      'npx',
      'roboter',
      task === 'default' ? [] : [ task ],
      getArgsList({ directory: testDirectory })
    ].flat();

    const gitignoreName = path.join(testDirectory, '.gitignore');
    const gitignore = stripIndent`
        node_modules
      `;

    await fs.promises.writeFile(gitignoreName, gitignore, { encoding: 'utf8' });

    const env = {
      ...processenv(),
      ...getEnv({ directory: testDirectory })
    };
    const roboter = shell.exec(roboterCmd.join(' '), { cwd: testDirectory, env });

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
  });
};

module.exports = createTest;
