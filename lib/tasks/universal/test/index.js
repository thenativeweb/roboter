'use strict';

const _ = require('lodash'),
      gulp = require('gulp'),
      runSequence = require('run-sequence');

const defaultConfiguration = {
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const test = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_test', done => {
    runSequence(
      'test-units',
      'test-integration',
      done);
  });

  gulp.task('_watch-test-continuously', done => {
    runSequence(
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
