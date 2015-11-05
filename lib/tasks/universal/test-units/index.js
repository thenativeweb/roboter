'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-spawn-mocha');

const defaultConfiguration = {
  asyncOnly: true,
  bail: true,
  reporter: 'spec',
  src: './test/units/**/*Tests.js',
  ui: 'tdd',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testUnits = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const runUnitTests = function () {
    return gulp.src(configuration.src, { read: false }).
      pipe(mocha({
        asyncOnly: configuration.asyncOnly,
        bail: configuration.bail,
        colors: true,
        reporter: configuration.reporter,
        ui: configuration.ui
      }));
  };

  gulp.task('_test-units', function () {
    return runUnitTests();
  });

  gulp.task('_test-units-continuously', function () {
    return runUnitTests().on('error', gutil.log);
  });

  gulp.task('_watch-test-units', function () {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'test-units-continuously' ]);
  });
};

module.exports = testUnits;
