'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-mocha');

const defaultConfiguration = {
  asyncOnly: true,
  bail: true,
  globals: {},
  reporter: 'spec',
  ui: 'tdd',
  src: './test/units/**/*Tests.js',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testUnits = function (userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

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

  gulp.task('_test-units-continuously', function () {
    return gulp.
      src(configuration.src, { read: false }).
      pipe(mocha({
        reporter: configuration.reporter,
        ui: configuration.ui,
        bail: configuration.bail,
        asyncOnly: configuration.asyncOnly,
        globals: configuration.globals
      })).
      on('error', gutil.log);
  });

  gulp.task('_watch-test-units', function () {
    gulp.watch(configuration.watch, [ 'test-units-continuously' ]);
  });
};

module.exports = testUnits;
