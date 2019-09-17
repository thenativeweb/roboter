'use strict';

const fs = require('fs').promises,
      path = require('path');

const asyncAF = require('async-af'),
      semver = require('semver');

const fileCandidates = require('../../../configuration/fileCandidatesForNodeVersionCheck'),
      files = require('../../files'),
      getLatestNodeLtsVersion = require('./getLatestNodeLtsVersion');

const findOutdatedNodeVersionReferences = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const latestVersion = semver.clean(await getLatestNodeLtsVersion());

  const filesToTest = await asyncAF(await fileCandidates()).filterAF(fileCandidate => files.exists({ path: fileCandidate }));

  const patternsToTest = [
    /node:(?<version>\d+\.\d+\.\d+)/u,
    /nvm install (?<version>v?\d+\.\d+\.\d+)/u,
    /nvm alias .*? (?<version>v?\d+\.\d+\.\d+)/u
  ];

  const matches = [];

  for (const file of filesToTest) {
    const fileContent = (await fs.readFile(path.join(directory, file))).toString();

    for (const pattern of patternsToTest) {
      const match = fileContent.match(pattern);

      if (match === null) {
        continue;
      }

      if (semver.satisfies(latestVersion, match)) {
        continue;
      }

      matches.push([ match.groups.version, latestVersion, file ]);
      break;
    }
  }

  return matches;
};

module.exports = findOutdatedNodeVersionReferences;
