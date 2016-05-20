'use strict';

const _ = require('lodash'),
      depcheck = require('gulp-depcheck'),
      gulp = require('gulp'),
      gutil = require('gulp-util');

const defaultConfiguration = {
  exclude: [ 'node_modules' ]
};

const unusedDependencies = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_unused-dependencies', done => {
    depcheck({
      ignoreDirs: configuration.exclude,
      ignoreMatches: []
    })().
      then(done).
      catch(err => {
        if (err.message.indexOf('You have unused dependencies') === -1) {
          return done(err);
        }
        gutil.log(err.message);

        return done();
      });
  });
};

module.exports = unusedDependencies;
