'use strict';

const fs = require('fs'),
      path = require('path');

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage'),
      promisify = require('util.promisify');

const errors = require('../../errors'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      licenseCompatibility = require('../../../configuration/licenseCompatibility'),
      licenseHeuristics = require('../../../configuration/licenseHeuristics'),
      packageLicenses = require('../../../configuration/packageLicenses');

const lstat = promisify(fs.lstat),
      readdir = promisify(fs.readdir),
      readFile = promisify(fs.readFile);

const getLicenseFromWhiteList = function ({ pkg, pkgVersion }) {
  if (!pkg) {
    throw new Error('Package is missing.');
  }
  if (!pkgVersion) {
    throw new Error('Package version is missing.');
  }

  const packageInWhitelist = packageLicenses[pkg];

  if (!packageInWhitelist) {
    return undefined;
  }

  const licenseForVersion = packageInWhitelist[pkgVersion];

  if (!licenseForVersion) {
    return undefined;
  }

  return licenseForVersion;
};

const getLicense = async function (directory) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  try {
    await lstat(path.join(directory, 'package.json'));
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

  const entries = await readdir(directory);

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryStat = await lstat(path.join(directory, entry));

    if (!entryStat.isFile()) {
      continue;
    }

    if (/^(copying|license|readme)(\.markdown|\.md|\.txt)?$/i.test(entry)) {
      const licenseFile = await readFile(path.join(directory, entry), { encoding: 'utf8' }),
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

const findIncompatiblePackages = async function ({ compatibleLicences, directory, myLicense }) {
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

    incompatiblePackages.push({ pkg, pkgVersion, pkgLicense, pkgPath: pkgPath.substring(pkgPath.indexOf('node_modules')) });
  }

  return incompatiblePackages;
};

const license = {
  description: 'Check dependencies for incompatible licenses.',

  async getOptionDefinitions () {
    return [];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }

    const directory = process.cwd(),
          { help } = options;

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter licsense', content: this.description },
        { header: 'Synopsis', content: 'roboter license' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    buntstift.line();
    buntstift.info('Running license check...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      const myLicense = await getLicense(directory);

      if (!myLicense || myLicense === 'UNKNOWN') {
        stopWaiting();
        buntstift.warn('Failed to get own license, skipping license check.');

        return;
      }

      const compatibleLicences = licenseCompatibility[myLicense];

      if (!compatibleLicences) {
        throw new errors.LicenseNotSupported();
      }

      const incompatiblePackages = await findIncompatiblePackages({
        compatibleLicences,
        directory,
        myLicense
      });

      stopWaiting();

      if (incompatiblePackages.length > 0) {
        const table = [];

        table.push([ 'Package', 'Version', 'License', 'Path' ]);
        table.push([]);

        incompatiblePackages.forEach(({ pkg, pkgVersion, pkgLicense, pkgPath }) => {
          table.push([ pkg, pkgVersion, pkgLicense, pkgPath ]);
        });

        buntstift.table(table);

        throw new errors.LicenseIncompatible();
      }

      buntstift.success('License check successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ELICENSEINCOMPATIBLE':
          buntstift.error('License check failed.');
          break;
        case 'ELICENSENOTSUPPORTED':
          buntstift.error('Your license is not supported.');
          break;
        default:
          buntstift.error('Failed to run license check.');
      }

      throw ex;
    }
  }
};

module.exports = license;
