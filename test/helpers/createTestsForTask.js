'use strict';

const fs = require('fs'),
      path = require('path');

const assert = require('assertthat'),
      buntstift = require('buntstift'),
      flatten = require('lodash/flatten'),
      shell = require('shelljs');

const runRoboterTask = require('./runRoboterTask');

const createTestsForTask = function ({ cwd, task, testCases, tempDirectory }) {
  if (!cwd) {
    throw new Error('Cwd is missing.');
  }
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!testCases) {
    throw new Error('Test cases are missing.');
  }
  if (!tempDirectory) {
    throw new Error('Temp directory is missing.');
  }

  suite(task, () => {
    testCases.forEach(testCase => {
      /* eslint-disable no-sync */
      if (!fs.statSync(path.join(cwd, task, testCase)).isDirectory()) {
        return;
      }
      /* eslint-enable no-sync */

      test(`${testCase.replace(/-/g, ' ')}.`, async () => {
        shell.mkdir('-p', tempDirectory);
        shell.cp('-r', path.join(cwd, task, testCase), tempDirectory);

        const tempTestDirectory = path.join(tempDirectory, testCase);

        let pre;

        try {
          /* eslint-disable global-require */
          pre = require(path.join(cwd, task, testCase, 'pre.js'));
          /* eslint-enable global-require */
        } catch (ex) {
          pre = async function () {
            // Dummy method as fallback
          };
        }

        buntstift.line();
        buntstift.info(`${task} - ${testCase}`);
        buntstift.newLine();

        await pre({ dirname: tempTestDirectory });

        const result = await runRoboterTask({ cwd, task, directory: tempTestDirectory });

        /* eslint-disable global-require */
        const expected = require(path.join(cwd, task, testCase, 'expected.js'));
        /* eslint-enable global-require */

        assert.that(result.exitCode).is.equalTo(expected.exitCode);

        assert.that(result.stderr).is.containing(expected.stderr);

        const expectedStdouts = flatten([ expected.stdout ]);

        let previousIndex = -1;

        expectedStdouts.forEach(stdout => {
          assert.that(result.stdout).is.containing(stdout);

          const currentIndex = result.stdout.indexOf(stdout);

          assert.that(currentIndex).is.greaterThan(previousIndex);

          previousIndex = currentIndex;
        });

        if (typeof expected.validate !== 'function') {
          return;
        }

        await expected.validate({
          dirname: tempTestDirectory,
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr
        });
      });
    });
  });
};

module.exports = createTestsForTask;
