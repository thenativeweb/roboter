'use strict';

const gulp = require('gulp'),
    minimist = require('minimist'),
    shell = require('shelljs');

const defaultConfiguration = {};

const update = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_update', function () {
    const args = minimist(process.argv.slice(2), {
      string: 'module',
      default: configuration
    });

    if (!args.module) {
      shell.rm('-rf', 'node_modules');
      shell.exec('npm install');
      return;
    }

    shell.rm('-rf', `node_modules/${args.module}`);
    shell.exec(`npm install ${args.module}`);
  });
};

module.exports = update;
