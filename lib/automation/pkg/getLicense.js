'use strict';

const fs = require('fs').promises,
      path = require('path');

const licenseHeuristics = require('../../../configuration/licenseHeuristics');

const getLicense = async function (directory) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  try {
    await fs.lstat(path.join(directory, 'package.json'));
  } catch {
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

  const entries = await fs.readdir(directory);

  for (const entry of entries) {
    const entryStat = await fs.lstat(path.join(directory, entry));

    if (!entryStat.isFile()) {
      continue;
    }

    if (/^(?<filename>copying|license|readme)(?<extension>\.markdown|\.md|\.txt)?$/ui.test(entry)) {
      const licenseFile = await fs.readFile(path.join(directory, entry), { encoding: 'utf8' }),
            licenseNames = Object.keys(licenseHeuristics);

      for (const licenseName of licenseNames) {
        const licenseRegex = licenseHeuristics[licenseName];

        if (licenseRegex.test(licenseFile)) {
          return licenseName;
        }
      }
    }
  }

  return 'UNKNOWN';
};

module.exports = getLicense;
