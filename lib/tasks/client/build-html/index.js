'use strict';

const _ = require('lodash'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: './src/**/*.html',
  watch: './src/**/*.html',
  buildDir: './build/'
};

const buildHtml = function (userConfiguration) {
  const configuration = _.merge({}, defaultConfiguration, userConfiguration);

  gulp.task('_build-html', function () {
    return gulp.src(configuration.src).
                pipe(gulp.dest(configuration.buildDir));
  });

  gulp.task('_watch-build-html', [ 'build-html' ], function () {
    gulp.watch(configuration.watch, [ 'build-html' ]);
  });
};

module.exports = buildHtml;
