'use strict';

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    shell = require('shelljs');

const gitcheckpending = function () {
  gulp.task('_gitcheckpending', function (done) {
    const behind = shell.exec('git status -s', { silent: true });

    if (behind.code !== 0) {
      return done(new gutil.PluginError('gitcheckpending', 'Failed to check pending changes.'));
    }

    if (behind.output.trim() !== '') {
      return done(new gutil.PluginError('gitcheckpending', 'You have pending changes.'));
    }

    done(null);
  });
};

module.exports = gitcheckpending;
