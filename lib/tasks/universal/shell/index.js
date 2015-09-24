'use strict';

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    shelljs = require('shelljs');

const shell = function (configuration) {
  configuration = configuration || {};

  Object.keys(configuration).forEach(scriptName => {
    gulp.task(scriptName, function (done) {
      const child = shelljs.exec(configuration[scriptName]);

      if (child.code !== 0) {
        return done(new gutil.PluginError(scriptName, 'Failed to execute.'));
      }

      done(null);
    });
  });
};

module.exports = shell;
