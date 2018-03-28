'use strict';

const buntstift = require('buntstift');

const errors = require('../../errors');

const findIncompatiblePackages = require('./findIncompatiblePackages'),
      getLicense = require('./getLicense'),
      licenseCompatibility = require('../../../configuration/licenseCompatibility');

const checkLicenseCompatibility = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  buntstift.line();
  buntstift.info('Verifying license compatibility...', { prefix: '▸' });

  const myLicense = await getLicense(directory);

  if (!myLicense || myLicense === 'UNKNOWN') {
    buntstift.warn('Failed to get own license, skipping license check.');

    return;
  }

  const compatibleLicences = licenseCompatibility[myLicense];

  if (!compatibleLicences) {
    buntstift.info('Your license is not supported.');
    throw new errors.LicenseNotSupported();
  }

  const incompatiblePackages = await findIncompatiblePackages({
    compatibleLicences,
    directory,
    myLicense
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

    buntstift.table(table);

    buntstift.info('License check failed.');
    throw new errors.LicenseIncompatible();
  }
};

module.exports = checkLicenseCompatibility;
