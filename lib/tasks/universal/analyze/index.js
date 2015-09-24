'use strict';

const eslint = require('gulp-eslint'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: './src/**/*.js'
};

const analyze = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_analyze', function () {
    return gulp.
      src(configuration.src).
      pipe(eslint()).
      pipe(eslint.format()).
      pipe(eslint.failAfterError());
  });
};

module.exports = analyze;
