'use strict';

const fs = require('fs'),
      path = require('path');

const globby = require('globby'),
      shell = require('shelljs'),
      { uuid } = require('uuidv4');

const createTest = require('../helpers/createTest3'),
      shallTestCaseBeExecuted = require('../helpers/shallTestCaseBeExecuted');

suite('roboter', function () {
  this.timeout(100 * 1000);

  const roboterPackageDirectory = path.join(shell.tempdir(), uuid());

  shell.mkdir(roboterPackageDirectory);

  shell.exec(`npm pack ${path.join(__dirname, '..', '..')}`, { cwd: roboterPackageDirectory });

  const roboterPackagePath = globby.sync([ path.join(roboterPackageDirectory, 'roboter*') ]);

  /* eslint-disable no-sync */
  fs.readdirSync(__dirname).forEach(task => {
    const taskDirectory = path.join(__dirname, task);

    if (!fs.statSync(taskDirectory).isDirectory()) {
      return;
    }

    suite(task, () => {
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
  /* eslint-enalbe no-sync */
});
