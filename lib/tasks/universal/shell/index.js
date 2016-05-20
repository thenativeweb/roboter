'use strict';

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      shelljs = require('shelljs');

const shell = function (roboter, configuration) {
  configuration = configuration || {};

  Object.keys(configuration).forEach(scriptName => {
    gulp.task(scriptName, done => {
      const child = shelljs.exec(configuration[scriptName]);

      if (child.code !== 0) {
        return done(new gutil.PluginError(scriptName, 'Failed to execute.'));
      }

      return done(null);
    });
  });
};

module.exports = shell;
