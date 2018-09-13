'use strict';

const fs = require('fs'),
      path = require('path');

const shell = require('shelljs');

const helpers = require('../helpers');

const tempDirectory = path.join(__dirname, 'temp');

const createTestCasesForTask = function ({ task }) {
  /* eslint-disable no-sync */
  const testCases = fs.readdirSync(path.join(__dirname, task));
  /* eslint-enable no-sync */

  helpers.createTestsForTask({
    cwd: __dirname,
    task,
    testCases,
    tempDirectory
  });
};

suite('roboter', function () {
  this.timeout(60 * 1000);

  setup(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  teardown(() => {
    // shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  if (process.argv.length === 11) {
    // Only a single test case should be run, specified as an additional command
    // line argument, e.g. 'npm run test analyse/fails-on-invalid-code'. The
    // preceding arguments are the options passed to mocha via the npm test
    // script.
    if (process.argv[10].includes('/')) {
      const testCaseOptions = process.argv[10].split('/');
      const task = testCaseOptions[0];
      const testCase = testCaseOptions[1];

      /* eslint-disable no-sync */
      if (!fs.statSync(path.join(__dirname, task, testCase)).isDirectory()) {
        return;
      }
      /* eslint-enable no-sync */

      helpers.createTestsForTask({
        cwd: __dirname,
        task,
        testCases: [ testCase ],
        tempDirectory
      });
    } else {
      const task = process.argv[10];

      createTestCasesForTask({ task });
    }

    return;
  }

  /* eslint-disable no-sync */
  fs.readdirSync(__dirname).forEach(task => {
    if (!fs.statSync(path.join(__dirname, task)).isDirectory()) {
      return;
    }
    if (task === 'temp') {
      return;
    }

    createTestCasesForTask({ task });
  });
  /* eslint-enalbe no-sync */
});
