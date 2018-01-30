'use strict';

const gulp = require('gulp'),
      sequence = require('gulp-sequence');

const watchClient = function (roboter) {
  gulp.task('_watch-client', done => {
    roboter.isWatching = true;

    sequence(
      'watch-app',
      'watch-copy-static',
      done
    );
  });
};

module.exports = watchClient;
