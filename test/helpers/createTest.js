'use strict';

const path = require('path');

const assert = require('assertthat'),
      buntstift = require('buntstift'),
      isolated = require('isolated'),
      shell = require('shelljs');

const createGitRepository = require('./createGitRepository'),
      runRoboterTask = require('./runRoboterTask');

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
    const tempDirectory = await isolated();

    shell.cp('-r', `${directory}/*`, tempDirectory);

    let pre;

    try {
      /* eslint-disable global-require */
      pre = require(path.join(tempDirectory, 'pre.js'));
      /* eslint-enable global-require */
    } catch {
      pre = async function () {
        // Intentionally left blank.
      };
    }

    buntstift.line();
    buntstift.info(`${task} - ${testCase}`);
    buntstift.newLine();

    const roboterPath = path.join(__dirname, '..', '..');

    shell.exec('npm install', { cwd: tempDirectory });
    shell.exec(`npm install ${roboterPath} --no-save`, { cwd: tempDirectory });

    const { remoteDirectory } = await createGitRepository({
      directory: tempDirectory
    });

    await pre({ cwd: tempDirectory, remoteDirectory });

    const result = await runRoboterTask({ task, directory: tempDirectory });

    /* eslint-disable global-require */
    const expected = require(path.join(tempDirectory, 'expected.js'));
    /* eslint-enable global-require */

    assert.that(result.stderr).is.containing(expected.stderr);
    assert.that(result.exitCode).is.equalTo(expected.exitCode);

    const expectedStdouts = [ expected.stdout ].flat();

    let previousIndex = -1;

    for (const expectedStdout of expectedStdouts) {
      assert.that(result.stdout).is.containing(expectedStdout);

      const currentIndex = result.stdout.indexOf(expectedStdout);

      assert.that(currentIndex).is.greaterThan(previousIndex);

      previousIndex = currentIndex;
    }

    if (typeof expected.validate !== 'function') {
      return;
    }

    await expected.validate({
      cwd: tempDirectory,
      remoteDirectory,
      exitCode: result.exitCode,
      stdout: result.stdout,
      stderr: result.stderr
    });
  });
};

module.exports = createTest;
