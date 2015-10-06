'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    minimist = require('minimist'),
    shell = require('shelljs');

const defaultConfiguration = {};

const update = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

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
