'use strict';

const eslint = require('gulp-eslint'),
    gulp = require('gulp');

const defaultConfig = {
  src: './src/**/*.js'
};

const analyze = function (config) {
  const configuration = config || defaultConfig;

  gulp.task('analyze', function () {
    return gulp.
      src(configuration.src).
      pipe(eslint()).
      pipe(eslint.format()).
      pipe(eslint.failAfterError());
  });
};

module.exports = analyze;
