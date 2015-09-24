'use strict';

const gulp = require('gulp'),
    mocha = require('gulp-mocha');

const defaultConfiguration = {
  reporter: 'spec',
  gobals: {},
  asyncOnly: true,
  bail: true,
  ui: 'tdd'
};

const testUnits = function (configuration) {
  configuration = configuration || defaultConfiguration;

  gulp.task('_test-units', function () {
    return gulp.
      src(configuration.src, { read: false }).
      pipe(mocha({
        reporter: configuration.reporter,
        ui: configuration.ui,
        bail: configuration.bail,
        asyncOnly: configuration.asyncOnly,
        globals: configuration.globals
      }));
  });
};

module.exports = testUnits;
