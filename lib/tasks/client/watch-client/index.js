'use strict';

const gulp = require('gulp'),
      runSequence = require('run-sequence');

const watchClient = function (roboter) {
  gulp.task('_watch-client', done => {
    roboter.isWatching = true;

    runSequence(
      'clean-client',
      'watch-copy-static',
      'watch-build-app',
      done);
  });
};

module.exports = watchClient;
