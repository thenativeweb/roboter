'use strict';

const path = require('path');

const _ = require('lodash'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      mocha = require('gulp-spawn-mocha');

const doesSourceExist = require('../../../shared/doesSourceExist');

const defaultConfiguration = {
  asyncOnly: true,
  bail: true,
  pre: './test/integration/pre.js',
  post: './test/integration/post.js',
  reporter: 'spec',
  src: './test/integration/**/*Tests.js',
  ui: 'tdd',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testIntegration = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const runPreTask = function (callback) {
    if (!doesSourceExist(configuration.pre)) {
      return callback(null);
    }

    gutil.log('Running pre task ...');

    /* eslint-disable global-require */
    const pre = require(path.join(process.cwd(), configuration.pre));
    /* eslint-enable global-require */

    pre(callback);
  };

  let hasPostTaskBeenRun = false;

  const runPostTask = function (callback) {
    if (hasPostTaskBeenRun) {
      return callback(null);
    }
    hasPostTaskBeenRun = true;

    if (!doesSourceExist(configuration.post)) {
      return callback(null);
    }

    gutil.log('Running post task ...');

    /* eslint-disable global-require */
    const post = require(path.join(process.cwd(), configuration.post));
    /* eslint-enable global-require */

    post(callback);
  };

  const runIntegrationTests = function (options, done) {
    if (!done) {
      done = options;
      options = {};
    }

    if (!doesSourceExist(configuration.src)) {
      return done(null);
    }

    runPreTask(errPreTask => {
      if (errPreTask) {
        return done(errPreTask);
      }

      const mochaOptions = {
        asyncOnly: configuration.asyncOnly,
        bail: configuration.bail,
        colors: true,
        reporter: configuration.reporter,
        ui: configuration.ui
      };

      if (configuration.babelize) {
        mochaOptions.compilers = 'js:babel-register';
      }

      const testStream = gulp.src(configuration.src, { read: false }).
        pipe(mocha(mochaOptions)).
        once('error', err => {
          runPostTask(() => {
            testStream.emit('error', err);
          });
        }).
        on('end', () => {
          runPostTask(done);
        });

      if (options.continuously) {
        testStream.on('error', gutil.log);
      }
    });
  };

  gulp.task('_test-integration', done => {
    runIntegrationTests(done);
  });

  gulp.task('_test-integration-continuously', done => {
    runIntegrationTests({ continuously: true }, done);
  });

  gulp.task('_watch-test-integration', () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'test-integration-continuously' ]);
  });
};

module.exports = testIntegration;
