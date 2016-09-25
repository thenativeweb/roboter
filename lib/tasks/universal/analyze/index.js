'use strict';

const _ = require('lodash'),
      eslint = require('gulp-eslint'),
      gulp = require('gulp');

const defaultConfiguration = {
  rules: 'eslint-config-es/2015/server',
  src: [ '**/*.js', '!coverage/**/*.js', '!node_modules/**/*.js' ]
};

const analyze = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_analyze', () =>
    gulp.
      src(configuration.src).
      pipe(eslint(configuration.rules)).
      pipe(eslint.format()).
      pipe(eslint.failAfterError()));

  gulp.task('_watch-analyze', [ 'analyze' ], () => {
    roboter.isWatching = true;
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;
