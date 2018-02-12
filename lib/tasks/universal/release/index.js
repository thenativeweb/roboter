'use strict';

const fs = require('fs');

const _ = require('lodash'),
      bump = require('gulp-bump'),
      git = require('gulp-git'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      minimist = require('minimist'),
      sequence = require('gulp-sequence'),
      shell = require('shelljs');

const defaultConfiguration = {
  type: 'patch',
  createDistribution: false,
  srcDir: 'lib',
  distributionDir: 'dist'
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
      default: configuration.type,
      string: 'type'
    });

    return gulp.
      src('./package.json').
      pipe(bump({ type: args.type || configuration.type }).
        on('error', gutil.log)).
      pipe(gulp.dest('./'));
  });

  gulp.task('_release-precompile', done => {
    if (!configuration.createDistribution) {
      return done(null);
    }

    shell.exec(`node_modules/.bin/babel "${configuration.srcDir}" --out-dir "${configuration.distributionDir}" --copy-files --presets=es2015,es2016,es2017,react --plugins transform-runtime`, (exitCode, stdout, stderr) => {
      if (exitCode !== 0) {
        return done(new Error(stderr));
      }
      done(null);
    });
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
    sequence(
      'gitcheckpending',
      'gitnobehind',
      'generate-toc',
      'release-bump-version',
      'release-precompile',
      'release-commit',
      'release-create-tag',
      'release-push',
      done
    );
  });

  gulp.task('_release', done => {
    sequence(
      'analyze',
      'test-units',
      'unused-dependencies',
      'outdated',
      'license',

      // Do not call the release-force task here (although it would make sense),
      // as there is a bug in run-sequence which prevents errors from being
      // handled correctly: If a task of the sub-sequence returns an error, the
      // chain should stop - but it doesn't. See thenativeweb/org-dev#255 for
      // details.
      'gitcheckpending',
      'gitnobehind',
      'generate-toc',
      'release-bump-version',
      'release-precompile',
      'release-commit',
      'release-create-tag',
      'release-push',
      done
    );
  });
};

module.exports = release;
