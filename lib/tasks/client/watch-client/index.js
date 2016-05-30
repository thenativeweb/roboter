'use strict';

const gulp = require('gulp'),
      runSequence = require('run-sequence');

const watchClient = function (roboter) {
  gulp.task('_watch-client', done => {
    roboter.isWatching = true;

    runSequence(
      'watch-app',
      'watch-copy-static',
      done);
  });
};

module.exports = watchClient;
