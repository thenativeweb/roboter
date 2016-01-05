'use strict';

const fs = require('fs');

const _ = require('lodash'),
    eslint = require('gulp-eslint'),
    eslintRules = require('eslint-config-es/2015/server'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
};

const tryRequire = function (packageName) {
  try {
    return require(packageName);
  } catch (err) {
    return null;
  }
};

const analyze = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  if (configuration.rules) {
    if (typeof configuration.rules === 'string') {
      let rules = tryRequire(configuration.rules);

      if (!rules) {
        rules = tryRequire('eslint-config-' + configuration.rules);
        if (!rules) {
          rules = JSON.parse(fs.readFileSync(configuration.rules));
        }
      }
      configuration.rules = rules;
    }
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
    roboter.isWatching = true;
    gulp.watch(configuration.src, [ 'analyze' ]);
  });
};

module.exports = analyze;
