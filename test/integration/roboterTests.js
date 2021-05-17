'use strict';

const fs = require('fs'),
      os = require('os'),
      path = require('path');

const globby = require('globby'),
      shell = require('shelljs');

const createTest = require('../helpers/createTest'),
      shallTestCaseBeExecuted = require('../helpers/shallTestCaseBeExecuted');

describe('roboter', function () {
  this.timeout(3_600_000);

  /* eslint-disable no-sync */
  const roboterPackageDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'roboter-'));
  /* eslint-enable no-sync */

  shell.mkdir(roboterPackageDirectory);

  shell.exec(`npm pack ${path.join(__dirname, '..', '..')}`, { cwd: roboterPackageDirectory });

  const roboterPackagePath = globby.sync([ path.join(roboterPackageDirectory, 'roboter*') ]);

  after(async () => {
    shell.rm('-rf', roboterPackageDirectory);
  });

  /* eslint-disable no-sync */
  fs.readdirSync(__dirname).forEach(task => {
    const taskDirectory = path.join(__dirname, task);

    if (!fs.statSync(taskDirectory).isDirectory()) {
      return;
    }

    describe(task, () => {
      fs.readdirSync(taskDirectory).forEach(testCase => {
        const testCaseDirectory = path.join(taskDirectory, testCase);

        if (!fs.statSync(testCaseDirectory).isDirectory()) {
          return;
        }

        if (!shallTestCaseBeExecuted({
          task,
          testCase,
          args: process.argv[10]
        })) {
          return;
        }

        createTest({ task, testCase, directory: testCaseDirectory, roboterPackagePath });
      });
    });
  });
  /* eslint-enable no-sync */
});
