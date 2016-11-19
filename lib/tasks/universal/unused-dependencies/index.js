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
      },
      detectors: [
        depcheck.detector.requireCallExpression,
        depcheck.detector.importDeclaration
      ],
      specials: [
        depcheck.special.babel,
        depcheck.special.eslint,
        depcheck.special.mocha,
        depcheck.special.webpack
      ]
    })().
      then(done).
      catch(err => {
        if (
          err.message.includes('You have unused dependencies') ||
          err.message.includes('You have missing dependencies')
        ) {
          gutil.log(err.message);

          return done();
        }

        done(err);
      });
  });
};

module.exports = unusedDependencies;
