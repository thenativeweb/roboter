'use strict';

const packageLicenses = require('../../../configuration/packageLicenses');

const getLicenseFromWhiteList = function ({ pkg, pkgVersion }) {
  if (!pkg) {
    throw new Error('Package is missing.');
  }
  if (!pkgVersion) {
    throw new Error('Package version is missing.');
  }

  const packageInWhitelist = packageLicenses[pkg];

  if (!packageInWhitelist) {
    return;
  }

  const licenseForVersion = packageInWhitelist[pkgVersion];

  if (!licenseForVersion) {
    return;
  }

  return licenseForVersion;
};

module.exports = getLicenseFromWhiteList;
