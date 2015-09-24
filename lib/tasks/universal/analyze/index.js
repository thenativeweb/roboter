'use strict';

const fs = require('fs');

const eslint = require('gulp-eslint'),
    eslintRules = require('eslint-config-es/2015/server'),
    gulp = require('gulp');

const defaultConfiguration = {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
};

const analyze = function (configuration) {
  configuration = configuration || defaultConfiguration;

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
};

module.exports = analyze;
