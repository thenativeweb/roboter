'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const watchClient = function () {
  gulp.task('_watch-client', function (done) {
    runSequence(
      [ 'watch-bundle-scripts', 'watch-build-themes', 'watch-build-html' ],
      'serve-client',
      done);
  });
};

module.exports = watchClient;
