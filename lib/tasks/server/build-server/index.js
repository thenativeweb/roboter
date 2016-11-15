'use strict';

const gulp = require('gulp'),
      sequence = require('gulp-sequence');

const buildServer = function () {
  gulp.task('_build-server', done => {
    sequence(
      'analyze',
      'test',
      'unused-dependencies',
      'outdated',
      done);
  });
};

module.exports = buildServer;
