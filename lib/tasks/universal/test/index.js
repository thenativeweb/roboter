'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const test = function () {
  gulp.task('_test', function (done) {
    runSequence(
      'test-units',
      'test-integration',
      done);
  });
};

module.exports = test;
