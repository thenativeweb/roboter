'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    mocha = require('gulp-mocha');

const defaultConfiguration = {
  reporter: 'spec',
  globals: {},
  asyncOnly: true,
  bail: true,
  ui: 'tdd',
  src: './test/units/**/*Tests.js'
};

const testUnits = function (userConfiguration) {
  const configuration = _.merge({}, defaultConfiguration, userConfiguration);

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
