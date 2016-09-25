'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      stringifyObject = require('stringify-object');

const licenseHeuristics = {
  'Apache 2.0': /Apache License, Version 2\.0/,
  'BSD*': /BSD/,
  'ISC*': /ISC/,
  'MIT*': /MIT/,
  'WTF*': /DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE/
};

const defaultConfiguration = {
  compatible: []
};

const getLicense = function (directory) {
  try {
    /* eslint-disable no-sync */
    fs.statSync(path.join(directory, 'package.json'));
    /* eslint-enable no-sync */
  } catch (ex) {
    // Apparently, there is no package.json file. Hence, return undefined to
    // indicate that no license could be retrieved (and the directory probably
    // does not contain a Node.js package at all).
    return undefined;
  }

  /* eslint-disable global-require */
  const packageJson = require(path.join(directory, 'package.json'));
  /* eslint-enable global-require */

  if (typeof packageJson.license === 'object') {
    return packageJson.license.type;
  }
  if (packageJson.license) {
    return packageJson.license;
  }

  /* eslint-disable no-sync */
  const files = fs.readdirSync(directory);
  /* eslint-enable no-sync */

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    /* eslint-disable no-sync */
    if (!fs.lstatSync(path.join(directory, file)).isFile()) {
      /* eslint-enable no-sync */
      continue;
    }

    if (/^license(\.md|\.txt)?$/i.test(file)) {
      /* eslint-disable no-sync */
      const licenseFile = fs.readFileSync(path.join(directory, file), { encoding: 'utf8' }),
      /* eslint-enable no-sync */
            licenseNames = Object.keys(licenseHeuristics);

      for (let j = 0; j < licenseNames.length; j++) {
        const licenseName = licenseNames[j],
              licenseRegex = licenseHeuristics[licenseName];

        if (licenseRegex.test(licenseFile)) {
          return licenseName;
        }
      }
    }
  }

  return 'UNKNOWN';
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

      if (!yourLicense) {
        return;
      }

      if (myLicense !== yourLicense && !configuration.compatible.includes(yourLicense)) {
        incompatiblePackages.push({ license: yourLicense, package: pkg });
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
