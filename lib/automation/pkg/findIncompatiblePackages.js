'use strict';

const fs = require('fs'),
      path = require('path');

const promisify = require('util.promisify');

const files = require('../../files'),
      getLicense = require('./getLicense'),
      getLicenseFromWhiteList = require('./getLicenseFromWhiteList');

const lstat = promisify(fs.lstat),
      readdir = promisify(fs.readdir);

const findIncompatiblePackages = async function ({ compatibleLicences, directory, myLicense }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!compatibleLicences) {
    throw new Error('Compatible licenses are missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!myLicense) {
    throw new Error('My license is missing.');
  }

  const incompatiblePackages = [];

  const nodeModulesPath = path.join(directory, 'node_modules');
  const hasNodeModules = await files.exists({ path: nodeModulesPath });

  if (!hasNodeModules) {
    return incompatiblePackages;
  }

  const entries = (await readdir(nodeModulesPath)).filter(entry => entry !== '.bin');

  for (let i = 0; i < entries.length; i++) {
    const pkg = entries[i],
          pkgPath = path.join(nodeModulesPath, pkg);

    const stats = await lstat(pkgPath);

    if (!stats.isDirectory()) {
      continue;
    }

    incompatiblePackages.push(...await findIncompatiblePackages({
      compatibleLicences,
      directory: pkgPath,
      myLicense
    }));

    const pkgLicense = await getLicense(pkgPath);

    // This directory has no package.json and therefore the license is undefined.
    if (!pkgLicense) {
      continue;
    }

    /* eslint-disable global-require */
    const pkgVersion = require(path.join(pkgPath, 'package.json')).version;
    /* eslint-enable global-require */

    const isSameLicense = myLicense === pkgLicense;
    const licenseFromWhiteList = getLicenseFromWhiteList({ pkg, pkgVersion });

    if (isSameLicense) {
      continue;
    }

    if (compatibleLicences.includes(pkgLicense) || compatibleLicences.includes(licenseFromWhiteList)) {
      continue;
    }

    incompatiblePackages.push({
      name: pkg,
      version: pkgVersion,
      license: pkgLicense,
      path: pkgPath.substring(pkgPath.indexOf('node_modules'))
    });
  }

  return incompatiblePackages;
};

module.exports = findIncompatiblePackages;
