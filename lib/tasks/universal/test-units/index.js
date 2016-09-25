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
  post: './test/units/post.js',
  pre: './test/units/pre.js',
  reporter: 'spec',
  src: './test/units/**/*Tests.js',
  ui: 'tdd',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testUnits = function (roboter, userConfiguration) {
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

  const runPostTask = function (callback) {
    if (!doesSourceExist(configuration.post)) {
      return callback(null);
    }

    gutil.log('Running post task ...');

    /* eslint-disable global-require */
    const post = require(path.join(process.cwd(), configuration.post));
    /* eslint-enable global-require */

    post(callback);
  };

  const runUnitTests = function (options, done) {
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

      let errFromTests;
      const testStream = gulp.src(configuration.src, { read: false }).
        pipe(mocha(mochaOptions)).
        once('error', err => {
          errFromTests = err;
        }).
        on('end', () => {
          runPostTask(() => {
            if (errFromTests) {
              testStream.emit('error', errFromTests);

              return done(errFromTests);
            }
            done(null);
          });
        });

      if (options.continuously) {
        testStream.on('error', gutil.log);
      }
    });
  };

  gulp.task('_test-units', done => {
    runUnitTests(done);
  });

  gulp.task('_test-units-continuously', done => {
    runUnitTests({ continuously: true }, done);
  });

  gulp.task('_watch-test-units', () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'test-units-continuously' ]);
  });
};

module.exports = testUnits;
