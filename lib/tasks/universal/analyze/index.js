'use strict';

const fs = require('fs');

const _ = require('lodash'),
    eslint = require('gulp-eslint'),
    eslintRules = require('eslint-config-es/2015/server'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
};

const analyze = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  if (configuration.rules) {
    configuration.rules = JSON.parse(fs.readFileSync(configuration.rules));
  } else {
    configuration.rules = eslintRules;
  }

  gulp.task('_analyze', function () {
    return gulp.
      src(configuration.src).
      pipe(eslint(configuration.rules)).
      pipe(eslint.format()).
      pipe(eslint.failAfterError());
  });

  gulp.task('_watch-analyze', [ 'analyze' ], function () {
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;
