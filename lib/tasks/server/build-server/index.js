'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const buildServer = function () {
  gulp.task('_build-server', function (done) {
    runSequence(
      'analyze',
      'test',
      'unused-dependencies',
      'outdated',
      done);
  });
};

module.exports = buildServer;
