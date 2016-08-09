'use strict';

const path = require('path');

const _ = require('lodash'),
      async = require('async'),
      git = require('gulp-git'),
      gulp = require('gulp'),
      minimist = require('minimist'),
      runSequence = require('run-sequence'),
      semver = require('semver'),
      shell = require('shelljs');

const defaultConfiguration = {};

const getDependencyFromPackageJson = function (packageJson, dependencyType, packageName) {
  if (semver.valid(packageJson[dependencyType][packageName])) {
    return {
      current: packageJson[dependencyType][packageName]
    };
  }
  if (packageJson[dependencyType][packageName].includes('#')) {
    const separator = '#';
    const parts = packageJson[dependencyType][packageName].split(separator);

    if (semver.valid(parts[1])) {
      return {
        current: parts[1],
        repository: parts[0],
        separator
      };
    }
  }

  return undefined;
};

const update = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_update-outdated', done => {
    const sources = {};
    const dependencyTypes = [ 'dependencies', 'devDependencies' ];

    /* eslint-disable global-require */
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    /* eslint-enable global-require */

    // Collect data from package.json.
    dependencyTypes.forEach(dependencyType => {
      if (packageJson[dependencyType]) {
        sources[dependencyType] = {};

        Object.keys(packageJson[dependencyType]).forEach(packageName => {
          const dependency = getDependencyFromPackageJson(packageJson, dependencyType, packageName);

          if (dependency) {
            sources[dependencyType][packageName] = dependency;
          }
        });
      }
    });

    // Get wanted versions from parameters.
    const packagesSpecifiedByUser = {};
    let packagesToUpdate = {};

    _.flatten([ minimist(process.argv.slice(2), {
      string: 'package',
      default: configuration
    }).package ]).
      filter(pkg => pkg).
      forEach(pkg => {
        const parts = pkg.split('@');

        let packageName = parts[0],
            packageVersion = parts[1];

        if (pkg.startsWith('@')) {
          packageName = `@${parts[1]}`;
          packageVersion = parts[2];
        }

        packagesSpecifiedByUser[packageName] = packageVersion;
      });

    if (Object.keys(packagesSpecifiedByUser).length === 0) {
      packagesToUpdate = sources;
    } else {
      Object.keys(packagesSpecifiedByUser).forEach(packageName => {
        dependencyTypes.forEach(dependencyType => {
          if (sources[dependencyType] && sources[dependencyType][packageName]) {
            packagesToUpdate[dependencyType] = packagesToUpdate[dependencyType] || {};
            packagesToUpdate[dependencyType][packageName] = sources[dependencyType][packageName];
            packagesToUpdate[dependencyType][packageName].wanted = packagesSpecifiedByUser[packageName];
          }
        });
      });
    }

    // Add missing wanted versions for npm-hosted packages.
    shell.exec('npm outdated --json', { silent: true }, (err, outdatedStdout) => {
      if (err) {
        return done(err);
      }

      const outdatedPackages = JSON.parse(outdatedStdout);

      Object.keys(packagesToUpdate).forEach(dependencyType => {
        Object.keys(packagesToUpdate[dependencyType]).forEach(packageName => {
          if (
            packagesToUpdate[dependencyType] &&
            packagesToUpdate[dependencyType][packageName] &&
            !packagesToUpdate[dependencyType][packageName].repository &&
            !packagesToUpdate[dependencyType][packageName].wanted
          ) {
            if (outdatedPackages[packageName] && outdatedPackages[packageName].latest) {
              packagesToUpdate[dependencyType][packageName].wanted = outdatedPackages[packageName].latest;
            } else {
              Reflect.deleteProperty(packagesToUpdate[dependencyType], packageName);
            }
          }
        });
      });

      // Add missing wanted versions for git-hosted packages.
      async.eachSeries(Object.keys(packagesToUpdate), (dependencyType, doneEach1) => {
        async.eachSeries(Object.keys(packagesToUpdate[dependencyType]), (packageName, doneEach2) => {
          if (
            packagesToUpdate[dependencyType] &&
            packagesToUpdate[dependencyType][packageName] &&
            packagesToUpdate[dependencyType][packageName].repository &&
            !packagesToUpdate[dependencyType][packageName].wanted
          ) {
            const repository = packagesToUpdate[dependencyType][packageName].repository.
              replace('git+ssh://', '').
              replace('git+https://', '');

            shell.exec(`git ls-remote --tags ${repository}`, { silent: true }, (errLsRemote, stdout) => {
              if (errLsRemote) {
                return doneEach2(errLsRemote);
              }

              const semverTags = stdout.match(/\d+\.\d+\.\d+$/gm);

              if (semverTags && semverTags.length > 0) {
                const sortedSemverTags = semverTags.sort(semver.rcompare);

                packagesToUpdate[dependencyType][packageName].wanted = sortedSemverTags[0];
              } else {
                Reflect.deleteProperty(packagesToUpdate[dependencyType], packageName);
              }
              doneEach2(null);
            });
          } else {
            doneEach2(null);
          }
        }, doneEach1);
      }, errEach => {
        if (errEach) {
          return done(errEach);
        }

        // Build installation paths and run npm.
        async.series([
          cb => {
            if (!packagesToUpdate.dependencies || packagesToUpdate.dependencies.length === 0) {
              return cb(null);
            }

            const dependencies = Object.
              keys(packagesToUpdate.dependencies).
              map(packageName => {
                const pkg = packagesToUpdate.dependencies[packageName];

                if (pkg.repository) {
                  return `${pkg.repository}${pkg.separator}${pkg.wanted}`;
                }

                return `${packageName}@${pkg.wanted}`;
              }).
              join(' ');

            shell.exec(`npm install ${dependencies} --save --save-exact`, errInstall => {
              if (errInstall) {
                return cb(errInstall);
              }
              cb(null);
            });
          },
          cb => {
            if (!packagesToUpdate.devDependencies || packagesToUpdate.devDependencies.length === 0) {
              return cb(null);
            }

            const devDependencies = Object.
              keys(packagesToUpdate.devDependencies).
              map(packageName => {
                const pkg = packagesToUpdate.devDependencies[packageName];

                if (pkg.repository) {
                  return `${pkg.repository}${pkg.separator}${pkg.wanted}`;
                }

                return `${packageName}@${pkg.wanted}`;
              }).
              join(' ');

            shell.exec(`npm install ${devDependencies} --save-dev --save-exact`, errInstall => {
              if (errInstall) {
                return cb(errInstall);
              }
              cb(null);
            });
          }
        ], errSeries => {
          if (errSeries) {
            return done(errSeries);
          }
          done();
        });
      });
    });
  });

  gulp.task('_update-commit', () => gulp.
    src('package.json').
    pipe(git.add()).
    pipe(git.commit('Update dependencies.')));

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
