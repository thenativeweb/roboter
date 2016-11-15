'use strict';

const _ = require('lodash'),
      gulp = require('gulp'),
      sequence = require('gulp-sequence');

const defaultConfiguration = {
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const test = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_test', done => {
    sequence(
      'test-units',
      'test-integration',
      done);
  });

  gulp.task('_watch-test-continuously', done => {
    sequence(
      'test-units-continuously',
      'test-integration-continuously',
      done);
  });

  gulp.task('_watch-test', () => {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'watch-test-continuously' ]);
  });
};

module.exports = test;
