'use strict';

const findIncompatiblePackages = require('./findIncompatiblePackages'),
      getLicense = require('./getLicense'),
      getLicenseFromWhiteList = require('./getLicenseFromWhiteList'),
      getWhitelistedPackages = require('./getWhitelistedPackages');

module.exports = {
  findIncompatiblePackages,
  getLicense,
  getLicenseFromWhiteList,
  getWhitelistedPackages
};
