'use strict';

const gulp = require('gulp'),
      runSequence = require('run-sequence');

const buildClient = function () {
  gulp.task('_build-client', done => {
    runSequence(
      'analyze',
      'test',
      'clean-client',
      [ 'build-app', 'copy-static' ],
      done);
  });
};

module.exports = buildClient;
