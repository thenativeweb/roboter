'use strict';

const checkLicenseCompatibility = require('./checkLicenseCompatibility'),
      findIncompatiblePackages = require('./findIncompatiblePackages'),
      getLicense = require('./getLicense'),
      getLicenseFromWhiteList = require('./getLicenseFromWhiteList'),
      getWhitelistedPackages = require('./getWhitelistedPackages');

module.exports = {
  checkLicenseCompatibility,
  findIncompatiblePackages,
  getLicense,
  getLicenseFromWhiteList,
  getWhitelistedPackages
};
