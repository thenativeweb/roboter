'use strict';

const errors = require('../../errors');

const findIncompatiblePackages = require('../../steps/license/findIncompatiblePackages'),
      getLicense = require('../../steps/license/getLicense'),
      getWhitelistedPackages = require('../../steps/license/getWhitelistedPackages'),
      licenseCompatibility = require('../../../configuration/licenseCompatibility');

const checkLicenseCompatibility = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('license check');

  try {
    const myLicense = await getLicense(directory);

    if (!myLicense || myLicense === 'UNKNOWN') {
      ui.warn('Failed to get own license, skipping license check.');

      return;
    }

    const compatibleLicences = licenseCompatibility[myLicense];

    if (!compatibleLicences) {
      ui.info('Your license is not supported.');
      throw new errors.LicenseNotSupported();
    }

    const whitelistedPackages = await getWhitelistedPackages({ directory });

    const incompatiblePackages = await findIncompatiblePackages({
      compatibleLicences,
      directory,
      myLicense,
      whitelistedPackages
    });

    if (incompatiblePackages.length > 0) {
      const table = [];

      table.push([ 'Package', 'Version', 'License', 'Path' ]);
      table.push([]);

      incompatiblePackages.forEach(incompatiblePackage => {
        table.push([
          incompatiblePackage.name,
          incompatiblePackage.version,
          incompatiblePackage.license,
          incompatiblePackage.path
        ]);
      });

      ui.table(table);
      ui.warn('There are incompatible dependencies.');

      throw new errors.LicenseIncompatible();
    }

    ui.printTaskSuccess('License check successful.');
  } catch (ex) {
    switch (ex.code) {
      case 'ELICENSEINCOMPATIBLE':
      case 'ELICENSENOTSUPPORTED':
        ui.printTaskFailure('License check failed.');
        throw new errors.LicenseCheckFailed();
      default:
        ui.error('Failed to run license check.');
        throw ex;
    }
  }
};

module.exports = checkLicenseCompatibility;
