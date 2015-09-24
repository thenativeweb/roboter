'use strict';

const gutil = require('gulp-util');

const gulp = require('gulp'),
    shell = require('shelljs');

const gitnobehind = function () {
  gulp.task('gitnobehind', function (done) {
    const behind = shell.exec('git fetch && git rev-list --right-only --count master...origin/master');

    if (behind.code !== 0) {
      return done(new gutil.PluginError('gitnobehind', 'Failed to compare branches.'));
    }

    if (behind.output.trim() !== '0') {
      return done(new gutil.PluginError('gitnobehind', 'The local master is behind origin/master, run git pull first.'));
    }

    done(null);
  });
};

module.exports = gitnobehind;
