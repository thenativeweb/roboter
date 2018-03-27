'use strict';

const fs = require('fs'),
      path = require('path');

const promisify = require('util.promisify');

const lstat = promisify(fs.lstat),
      readdir = promisify(fs.readdir),
      readFile = promisify(fs.readFile);

const licenseHeuristics = require('../../../configuration/licenseHeuristics');

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

module.exports = getLicense;
