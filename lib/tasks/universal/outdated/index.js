'use strict';

const gulp = require('gulp'),
    shell = require('shelljs');

const outdated = function () {
  gulp.task('_outdated', function () {
    const child = shell.exec('npm outdated --depth 0', { async: true });

    return child.stdout;
  });
};

module.exports = outdated;
