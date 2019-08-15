'use strict';

const fs = require('fs'),
      path = require('path');

const shell = require('shelljs');

const {
  createTest,
  shallTestCaseBeExecuted
} = require('../helpers');

suite('roboter', function () {
  this.timeout(60 * 1000);

  suiteSetup(async function () {
    this.timeout(5 * 60 * 1000);

    shell.exec('docker build -t thenativeweb/roboter-test .', {
      cwd: path.join(__dirname, '..', '..')
    });
  });

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

        createTest({ task, testCase, directory: testCaseDirectory });
      });
    });
  });
  /* eslint-enalbe no-sync */
});
