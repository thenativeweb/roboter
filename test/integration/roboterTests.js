'use strict';

const fs = require('fs'),
      path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const tempDirectory = path.join(__dirname, 'temp');

const runRoboterTask = function (task, testCase, callback) {
  const gulp = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'gulp'),
        gulpFile = path.join(tempDirectory, testCase, 'roboter.js');

  shell.exec(`${gulp} --gulpfile ${gulpFile} ${task}`, (exitCode, stdout, stderr) => {
    callback(null, { exitCode, stdout, stderr });
  });
};

suite('roboter', () => {
  setup(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  teardown(() => {
    shell.rm('-rf', path.join(tempDirectory, '*'));
  });

  /* eslint-disable no-sync */
  fs.readdirSync(__dirname).forEach(task => {
    if (!fs.statSync(path.join(__dirname, task)).isDirectory()) {
      return;
    }
    if (task === 'temp') {
      return;
    }

    suite(task, () => {
      fs.readdirSync(path.join(__dirname, task)).forEach(testCase => {
        if (!fs.statSync(path.join(__dirname, task, testCase)).isDirectory()) {
          return;
        }
        /* eslint-disable no-sync */

        test(`${testCase.replace(/-/g, ' ')}.`, done => {
          shell.mkdir('-p', tempDirectory);
          shell.cp('-r', path.join(__dirname, task, testCase), tempDirectory);

          const tempTestDirectory = path.join(tempDirectory, testCase);

          let pre;

          try {
            /* eslint-disable global-require */
            pre = require(path.join(__dirname, task, testCase, 'pre.js'));
            /* eslint-enable global-require */
          } catch (ex) {
            pre = function (options, callback) {
              callback(null);
            };
          }

          pre({ dirname: tempTestDirectory }, errPre => {
            assert.that(errPre).is.null();

            runRoboterTask(task, testCase, (err, options) => {
              assert.that(err).is.null();

              /* eslint-disable global-require */
              const expected = require(path.join(__dirname, task, testCase, 'expected.js'));
              /* eslint-enable global-require */

              assert.that(options.exitCode).is.equalTo(expected.exitCode);
              assert.that(options.stdout).is.containing(expected.stdout);
              assert.that(options.stderr).is.containing(expected.stderr);
              done();
            });
          });
        });
      });
    });
  });
});
