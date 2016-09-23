'use strict';

const _ = require('lodash'),
      depcheck = require('depcheck'),
      gulp = require('gulp'),
      gulpDepcheck = require('gulp-depcheck'),
      gutil = require('gulp-util');

const defaultConfiguration = {
  exclude: [ 'node_modules' ]
};

const unusedDependencies = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_unused-dependencies', done => {
    gulpDepcheck({
      ignoreDirs: configuration.exclude,
      ignoreMatches: [ 'roboter-client', 'roboter-server' ],
      parsers: {
        '*.js': depcheck.parser.es6,
        '*.jsx': depcheck.parser.jsx
      }
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
