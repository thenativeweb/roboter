'use strict';

const fs = require('fs');

const _ = require('lodash'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    minimist = require('minimist'),
    runSequence = require('run-sequence');

const defaultConfiguration = {
  type: 'patch'
};

const getPackageJsonVersion = function () {
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won't be updated.
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
};

const release = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_release-bump-version', function () {
    const args = minimist(process.argv.slice(2), {
      string: 'type',
      default: configuration.type
    });

    return gulp.
      src('./package.json').
      pipe(bump({ type: args.type || configuration.type }).
      on('error', gutil.log)).
      pipe(gulp.dest('./'));
  });

  gulp.task('_release-commit', function () {
    return gulp.
      src('.').
      pipe(git.add()).
      pipe(git.commit(`Released ${getPackageJsonVersion()}.`));
  });

  gulp.task('_release-create-tag', function (done) {
    const version = getPackageJsonVersion();

    git.tag(version, 'Created tag for version: ' + version, done);
  });

  gulp.task('_release-push', function (done) {
    git.push('origin', 'master', { args: '--tags' }, done);
  });

  gulp.task('_release-force', function (done) {
    runSequence(
      'gitcheckpending',
      'gitnobehind',
      'release-bump-version',
      'release-commit',
      'release-create-tag',
      'release-push',
      done);
  });

  gulp.task('_release', function (done) {
    runSequence(
      'analyze',
      'test-units',
      'outdated',
      'release-force',
      done);
  });
};

module.exports = release;
