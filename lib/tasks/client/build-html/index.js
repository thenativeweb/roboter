'use strict';

const _ = require('lodash'),
      gulp = require('gulp'),
      preprocess = require('gulp-preprocess');

const defaultConfiguration = {
  src: './src/**/*.html',
  watch: './src/**/*.html',
  buildDir: './build/'
};

const buildHtml = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_build-html', () => gulp.src(configuration.src).
    pipe(preprocess()).
    pipe(gulp.dest(configuration.buildDir)));

  gulp.task('_watch-build-html', [ 'build-html' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'build-html' ]);
  });
};

module.exports = buildHtml;
