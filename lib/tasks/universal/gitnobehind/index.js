'use strict';

const gulp = require('gulp'),
      gutil = require('gulp-util'),
      shell = require('shelljs');

const gitnobehind = function () {
  gulp.task('_gitnobehind', done => {
    const gitFetch = 'git fetch && git rev-list --right-only --count master...origin/master';
    const behind = shell.exec(gitFetch);

    if (behind.code !== 0) {
      return done(new gutil.PluginError('gitnobehind', 'Failed to compare branches.'));
    }

    if (behind.output.trim() !== '0') {
      return done(new gutil.PluginError(
        'gitnobehind', 'The local master is behind origin/master, run git pull first.'));
    }

    return done(null);
  });
};

module.exports = gitnobehind;
