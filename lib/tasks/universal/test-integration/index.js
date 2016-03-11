'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    mocha = require('gulp-spawn-mocha');

const doesSourceExist = require('../../../shared/doesSourceExist');

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

  const runIntegrationTests = function (options, done) {
    if (!done) {
      done = options;
      options = {};
    }

    if (!doesSourceExist(configuration.src)) {
      return done(null);
    }

    const testStream = gulp.src(configuration.src, { read: false }).
      pipe(mocha({
        asyncOnly: configuration.asyncOnly,
        bail: configuration.bail,
        colors: true,
        reporter: configuration.reporter,
        ui: configuration.ui
      })).
      on('end', done);

    if (options.continuously) {
      testStream.on('error', gutil.log);
    }
  };

  gulp.task('_test-integration', function (done) {
    runIntegrationTests(done);
  });

  gulp.task('_test-integration-continuously', function (done) {
    runIntegrationTests({ continuously: true }, done);
  });

  gulp.task('_watch-test-integration', function () {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'test-integration-continuously' ]);
  });
};

module.exports = testIntegration;
