'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const watchServer = function () {
  gulp.task('_watch-server', function (done) {
    runSequence(
      'analyse',
      'test-units',
      done);
  });
};

module.exports = watchServer;
