'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      stringifyObject = require('stringify-object');

const defaultConfiguration = {
  compatible: []
};

const getLicense = function (directory) {
  let packageJson;

  try {
    /* eslint-disable global-require */
    packageJson = require(path.join(directory, 'package.json'));
    /* eslint-enable global-require */
  } catch (ex) {
    return undefined;
  }

  if (typeof packageJson.license === 'object') {
    return packageJson.license.type;
  }

  return packageJson.license;
};

const license = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_license', done => {
    const cwd = process.cwd(),
          myLicense = getLicense(cwd);

    if (!myLicense) {
      return done(new gutil.PluginError('license', 'Failed to get own license.'));
    }

    /* eslint-disable no-sync */
    const entries = fs.readdirSync(path.join(cwd, 'node_modules'));
    /* eslint-enable no-sync */
    const incompatiblePackages = [];

    entries.forEach(entry => {
      const pkg = entry,
            pkgPath = path.join(cwd, 'node_modules', entry);

      /* eslint-disable no-sync */
      const stats = fs.lstatSync(pkgPath);
      /* eslint-enable no-sync */

      if (!stats.isDirectory()) {
        return;
      }

      const yourLicense = getLicense(pkgPath);

      if (myLicense !== yourLicense && !configuration.compatible.includes(yourLicense)) {
        incompatiblePackages.push({ package: pkg, license: yourLicense || 'unknown' });
      }
    });

    if (Object.keys(incompatiblePackages).length > 0) {
      /* eslint-disable no-console */
      console.log(stringifyObject(incompatiblePackages, {
        /* eslint-enable no-console */
        indent: '  ',
        singleQuotes: true
      }));

      return done(new gutil.PluginError('license', 'Incompatible licenses found.'));
    }

    done(null);
  });
};

module.exports = license;
