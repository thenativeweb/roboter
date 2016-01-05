'use strict';

const _ = require('lodash'),
    eslint = require('gulp-eslint'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
};

const analyze = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  if (!configuration.rules) {
    configuration.rules = 'eslint-config-es/2015/server';
  }

  gulp.task('_analyze', function () {
    return gulp.
      src(configuration.src).
      pipe(eslint(configuration.rules)).
      pipe(eslint.format()).
      pipe(eslint.failAfterError());
  });

  gulp.task('_watch-analyze', [ 'analyze' ], function () {
    roboter.isWatching = true;
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;
