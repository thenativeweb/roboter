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
  src: './test/units/**/*Tests.js',
  ui: 'tdd',
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const testUnits = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  const runUnitTests = function (options, done) {
    if (!done) {
      done = options;
      options = {};
    }

    if (!doesSourceExist(configuration.src)) {
      return done(null);
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
      on('end', done);

    if (options.continuously) {
      testStream.on('error', gutil.log);
    }

    return undefined;
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
