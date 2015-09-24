'use strict';

const gulp = require('gulp');

const defaultConfiguration = {
  src: './src/*.html',
  watch: './src/*.html',
  buildDir: './build/'
};

const buildHtml = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_build-html', function () {
    return gulp.src(configuration.src).
                pipe(gulp.dest(configuration.buildDir));
  });

  gulp.task('_build-html-watch', function () {
    gulp.watch(configuration.watch, [ 'build-html' ]);
  });
};

module.exports = buildHtml;
