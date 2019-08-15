'use strict';

const path = require('path');

const fs = require('fs-extra');

const files = require('../../files'),
      getLicense = require('./getLicense'),
      getLicenseFromWhiteList = require('./getLicenseFromWhiteList');

const findIncompatiblePackages = async function ({ compatibleLicences, directory, myLicense, whitelistedPackages }) {
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
  if (!whitelistedPackages) {
    throw new Error('Whitelisted packages are missing.');
  }

  const incompatiblePackages = [];

  const nodeModulesPath = path.join(directory, 'node_modules');
  const hasNodeModules = await files.exists({ path: nodeModulesPath });

  if (!hasNodeModules) {
    return incompatiblePackages;
  }

  const entries = (await fs.readdir(nodeModulesPath)).filter(entry => entry !== '.bin');

  for (const pkg of entries) {
    const pkgPath = path.join(nodeModulesPath, pkg);

    const stats = await fs.lstat(pkgPath);

    if (!stats.isDirectory()) {
      continue;
    }

    incompatiblePackages.push(...await findIncompatiblePackages({
      compatibleLicences,
      directory: pkgPath,
      myLicense,
      whitelistedPackages
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

    if (whitelistedPackages.includes(pkg)) {
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
