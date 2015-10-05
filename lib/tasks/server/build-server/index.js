'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const buildServer = function () {
  gulp.task('_build-server', function (done) {
    runSequence(
      'analyze',
      'test-units',
      done);
  });
};

module.exports = buildServer;
