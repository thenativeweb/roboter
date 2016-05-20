'use strict';

const gulp = require('gulp'),
      runSequence = require('run-sequence');

const watchClient = function (roboter) {
  gulp.task('_watch-client', done => {
    roboter.isWatching = true;

    runSequence(
      'clean-client',
      [ 'watch-build-scripts', 'watch-build-themes', 'watch-build-html', 'watch-copy-static' ],
      'serve-client',
      done);
  });
};

module.exports = watchClient;
