'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-spawn-mocha');

const defaultConfiguration = {
  asyncOnly: true,
  bail: true,
  reporter: 'spec',
  src: './test/integration/**/*Tests.js',
  ui: 'tdd',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testIntegration = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const runIntegrationTests = function () {
    return gulp.src(configuration.src, { read: false }).
      pipe(mocha({
        asyncOnly: configuration.asyncOnly,
        bail: configuration.bail,
        colors: true,
        reporter: configuration.reporter,
        ui: configuration.ui
      }));
  };

  gulp.task('_test-integration', function () {
    return runIntegrationTests();
  });

  gulp.task('_test-integration-continuously', function () {
    return runIntegrationTests().on('error', gutil.log);
  });

  gulp.task('_watch-test-integration', function () {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'test-integration-continuously' ]);
  });
};

module.exports = testIntegration;
