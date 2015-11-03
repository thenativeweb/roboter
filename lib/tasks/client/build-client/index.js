'use strict';

const gulp = require('gulp'),
    runSequence = require('run-sequence');

const buildClient = function () {
  gulp.task('_build-client', function (done) {
    runSequence(
      'analyze',
      'test-units',
      'clean-client',
      [ 'build-scripts', 'build-themes', 'build-html', 'copy-static' ],
      done);
  });
};

module.exports = buildClient;
