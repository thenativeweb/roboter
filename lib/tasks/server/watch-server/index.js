'use strict';

const gulp = require('gulp'),
      runSequence = require('run-sequence');

const watchServer = function (roboter) {
  gulp.task('_watch-server', done => {
    roboter.isWatching = true;

    runSequence(
      'watch-test',
      done);
  });
};

module.exports = watchServer;
