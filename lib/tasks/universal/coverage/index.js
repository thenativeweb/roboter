'use strict';

const _ = require('lodash'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      istanbul = require('gulp-istanbul'),
      mocha = require('gulp-mocha');

const doesSourceExist = require('../../../shared/doesSourceExist');

const defaultConfiguration = {
  asyncOnly: true,
  bail: true,
  includeUntested: false,
  report: {
    dir: './coverage',
    reporters: [ 'html', 'text-summary' ],
    reportOpts: { dir: './coverage' }
  },
  src: [ './lib/**/*.js', './src/**/*.js' ],
  test: './test/units/**/*Tests.js',
  threshold: 0,
  ui: 'tdd'
};

const coverage = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  configuration.thresholds = {};
  configuration.thresholds.global = configuration.threshold;

  Reflect.deleteProperty(configuration, 'threshold');

  const runCoveragePre = function () {
    if (!doesSourceExist(configuration.src)) {
      return null;
    }

    return gulp.src(configuration.src).
      pipe(istanbul({
        includeUntested: configuration.includeUntested
      })).
      pipe(istanbul.hookRequire());
  };

  const runCoverage = function (options, done) {
    if (!done) {
      done = options;
      options = {};
    }

    if (!doesSourceExist(configuration.src)) {
      return done(null);
    }

    const coverageStream = gulp.src(configuration.test).
      pipe(mocha({
        asyncOnly: configuration.asyncOnly,
        bail: configuration.bail,
        ui: configuration.ui
      })).
      pipe(istanbul.writeReports(configuration.report)).
      pipe(istanbul.enforceThresholds({
        thresholds: configuration.thresholds
      })).
      on('end', done);

    if (options.continuously) {
      coverageStream.on('error', gutil.log);
    }

    return undefined;
  };

  gulp.task('_coverage-pre', () => {
    runCoveragePre();
  });

  gulp.task('_coverage', [ '_coverage-pre' ], done => {
    runCoverage(done);
  });
};

module.exports = coverage;
