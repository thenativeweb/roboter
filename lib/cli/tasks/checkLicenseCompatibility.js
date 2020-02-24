'use strict';

const errors = require('../../errors');

const findIncompatiblePackages = require('../../steps/license/findIncompatiblePackages'),
      getLicense = require('../../steps/license/getLicense'),
      getWhitelistedPackages = require('../../steps/license/getWhitelistedPackages'),
      licenseCompatibility = require('../../../configuration/licenseCompatibility'),
      runPreOrPostTask = require('./runPreOrPostTask');

const checkLicenseCompatibility = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'pre' });

    ui.printTaskHeader('license check');

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

      incompatiblePackages.forEach(incompatiblePackage => {
        table.push({
          package: incompatiblePackage.name,
          version: incompatiblePackage.version,
          license: incompatiblePackage.license,
          path: incompatiblePackage.path
        });
      });

      ui.table(table);
      ui.warn('There are incompatible dependencies.');
      throw new errors.LicenseIncompatible();
    }

    ui.printTaskSuccess('License check successful.');

    await runPreOrPostTask({ directory, ui, task: 'license', phase: 'post' });
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
