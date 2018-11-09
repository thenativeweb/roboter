'use strict';

const fs = require('fs'),
      path = require('path');

const promisify = require('util.promisify');

const lstat = promisify(fs.lstat);

const whitelistedPackages = require('../../../configuration/whitelistedPackages');

const getWhitelistedPackages = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  try {
    await lstat(path.join(directory, 'package.json'));
  } catch (ex) {
    // Apparently, there is no package.json file. Hence, return an empty list to
    // indicate that no whitelisted licenses could be retrieved (and the
    // directory probably does not contain a Node.js package at all).
    return [];
  }

  /* eslint-disable global-require */
  const packageJson = require(path.join(directory, 'package.json'));
  /* eslint-enable global-require */

  const packageName = packageJson.name;
  const whitelistedPackagesForPackage = whitelistedPackages[packageName];

  if (!whitelistedPackagesForPackage) {
    return [];
  }

  return whitelistedPackagesForPackage;
};

module.exports = getWhitelistedPackages;
