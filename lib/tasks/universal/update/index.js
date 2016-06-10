'use strict';

const path = require('path');

const _ = require('lodash'),
      async = require('async'),
      git = require('gulp-git'),
      gulp = require('gulp'),
      minimist = require('minimist'),
      runSequence = require('run-sequence'),
      shell = require('shelljs');

const defaultConfiguration = {};

const isSpecificVersion = function (pkg) {
  // Check if an @ exists. This indicates a specific version. But it must not
  // be at position 0, since this is reserved for scoped packages.
  return pkg.indexOf('@') > 0;
};

const isScoped = function (pkg) {
  return pkg.indexOf('@') === 0;
};

const getNameWithoutVersion = function (pkg) {
  if (isScoped(pkg)) {
    return `@${pkg.split('@')[1]}`;
  }

  return pkg.split('@')[0];
};

const update = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_update-outdated', done => {
    shell.exec('npm outdated --json', { silent: true }, (errOutdated, outdatedStdout) => {
      if (errOutdated) {
        return done(errOutdated);
      }

      const outdatedPackages = JSON.parse(outdatedStdout);

      let packagesToUpdate = _.flatten([ minimist(process.argv.slice(2), {
        string: 'package',
        default: configuration
      }).package ]).filter(pkg => pkg);

      if (packagesToUpdate.length === 0) {
        packagesToUpdate = Object.keys(outdatedPackages);
      }

      const dependencies = [];
      const devDependencies = [];

      /* eslint-disable global-require */
      const packageJson = require(path.join(process.cwd(), 'package.json'));
      /* eslint-enable global-require */

      packagesToUpdate.forEach(pkg => {
        // Check if an @ already exists. This indicates a specific version that
        // the user is interested in. But it must not be at position 0, since
        // this is reserved for scoped packages.
        if (isSpecificVersion(pkg)) {
          const pkgName = getNameWithoutVersion(pkg);

          if (packageJson.dependencies[pkgName]) {
            dependencies.push(pkg);
          } else if (packageJson.devDependencies[pkgName]) {
            devDependencies.push(pkg);
          }
        } else if (outdatedPackages[pkg]) {
          if (packageJson.dependencies[pkg]) {
            dependencies.push(`${pkg}@${outdatedPackages[pkg].latest}`);
          } else if (packageJson.devDependencies[pkg]) {
            devDependencies.push(`${pkg}@${outdatedPackages[pkg].latest}`);
          }
        }
      });

      async.series([
        cb => {
          if (dependencies.length === 0) {
            return cb(null);
          }
          shell.exec(`npm install ${dependencies.join(' ')} --save --save-exact`, err => {
            if (err) {
              return cb(err);
            }
            cb(null);
          });
        },
        cb => {
          if (devDependencies.length === 0) {
            return cb(null);
          }
          shell.exec(`npm install ${devDependencies.join(' ')} --save-dev --save-exact`, err => {
            if (err) {
              return cb(err);
            }
            cb(null);
          });
        }
      ], err => {
        if (err) {
          return done(err);
        }
        done();
      });
    });
  });

  gulp.task('_update-commit', () => gulp.
    src('package.json').
    pipe(git.add()).
    pipe(git.commit('Updated dependencies.')));

  gulp.task('_update', done => {
    runSequence(
      'gitcheckpending',
      'gitnobehind',
      'update-outdated',
      'test-units',
      'test-integration',
      'update-commit',
      done);
  });
};

module.exports = update;
