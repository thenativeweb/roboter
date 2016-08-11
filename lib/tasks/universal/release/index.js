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
  /* eslint-disable no-sync */
  // We parse the json file instead of using require because require caches
  // multiple calls so the version number won't be updated.
  return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
  /* eslint-enable no-sync */
};

const release = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_release-bump-version', () => {
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

  gulp.task('_release-commit', () => gulp.
    src('.').
    pipe(git.add()).
    pipe(git.commit(`Release ${getPackageJsonVersion()}.`)));

  gulp.task('_release-create-tag', done => {
    const version = getPackageJsonVersion();

    git.tag(version, `Create tag for version: ${version}`, done);
  });

  gulp.task('_release-push', done => {
    git.push('origin', 'master', { args: '--tags' }, done);
  });

  gulp.task('_release-force', done => {
    runSequence(
      'gitcheckpending',
      'gitnobehind',
      'generate-toc',
      'release-bump-version',
      'release-commit',
      'release-create-tag',
      'release-push',
      done);
  });

  gulp.task('_release', done => {
    runSequence(
      'analyze',
      'test-units',
      'unused-dependencies',
      'outdated',

      // Do not call the release-force task here (although it would make sense),
      // as there is a bug in run-sequence which prevents errors from being
      // handled correctly: If a task of the sub-sequence returns an error, the
      // chain should stop - but it doesn't. See thenativeweb/org-dev#255 for
      // details.
      'gitcheckpending',
      'gitnobehind',
      'generate-toc',
      'release-bump-version',
      'release-commit',
      'release-create-tag',
      'release-push',
      done);
  });
};

module.exports = release;
