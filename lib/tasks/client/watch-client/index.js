'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const watchClient = function () {
  gulp.task('_watch-client', function (done) {
    runSequence(
      [ 'watch-bundle-scripts', 'watch-themes' ],
      'serve-client',
      done);
  });
};

module.exports = watchClient;
