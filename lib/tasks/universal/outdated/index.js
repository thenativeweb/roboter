'use strict';

const gulp = require('gulp'),
      shell = require('shelljs');

const outdated = function () {
  gulp.task('_outdated', () => {
    const child = shell.exec('npm outdated', { async: true });

    return child.stdout;
  });
};

module.exports = outdated;
