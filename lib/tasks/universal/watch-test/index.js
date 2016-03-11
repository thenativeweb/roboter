'use strict';

const _ = require('lodash'),
    gulp = require('gulp'),
    runSequence = require('run-sequence');

const defaultConfiguration = {
  watch: [ './**/*.js', '!./node_modules/**/*.js' ]
};

const watchTest = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_watch-test-continuously', function (done) {
    runSequence(
      'test-units-continuously',
      'test-integration-continuously',
      done);
  });

  gulp.task('_watch-test', function () {
    roboter.isWatching = true;
    gulp.watch(configuration.watch, [ 'watch-test-continuously' ]);
  });
};

module.exports = watchTest;
