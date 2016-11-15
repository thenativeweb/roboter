'use strict';

const gulp = require('gulp'),
      sequence = require('gulp-sequence');

const watchServer = function (roboter) {
  gulp.task('_watch-server', done => {
    roboter.isWatching = true;

    sequence(
      'watch-test',
      done);
  });
};

module.exports = watchServer;
