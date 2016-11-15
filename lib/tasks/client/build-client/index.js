'use strict';

const gulp = require('gulp'),
      sequence = require('gulp-sequence');

const buildClient = function () {
  gulp.task('_build-client', done => {
    sequence(
      'analyze',
      'test',
      [ 'build-app', 'copy-static' ],
      done);
  });
};

module.exports = buildClient;
