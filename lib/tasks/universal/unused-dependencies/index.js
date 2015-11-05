'use strict';

const _ = require('lodash'),
    depcheck = require('gulp-depcheck'),
    gulp = require('gulp');

const defaultConfiguration = {
  exclude: [ 'node_modules' ]
};

const unusedDependencies = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_unused-dependencies', depcheck({
    ignoreDirs: configuration.exclude,
    ignoreMatches: []
  }));
};

module.exports = unusedDependencies;
