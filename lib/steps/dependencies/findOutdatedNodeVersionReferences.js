'use strict';

const fs = require('fs').promises,
      path = require('path');

const asyncAF = require('async-af'),
      semver = require('semver');

const fileCandidates = require('../../../configuration/fileCandidatesForNodeVersionCheck'),
      files = require('../../files'),
      getLatestNodeLtsVersion = require('./getLatestNodeLtsVersion');

const findOutdatedNodeVersionReferences = async function ({ directory, replace = false }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const latestVersion = semver.clean(await getLatestNodeLtsVersion());

  const filesToTest = await asyncAF(await fileCandidates()).filterAF(fileCandidate => files.exists({ path: fileCandidate }));

  const patternsToTest = [
    /node:(?<version>\d+\.\d+\.\d+)/gu,
    /nvm install v?(?<version>\d+\.\d+\.\d+)/gu,
    /nvm alias .*? v?(?<version>\d+\.\d+\.\d+)/gu
  ];

  const matchesFound = [];

  for (const file of filesToTest) {
    const fileContent = await fs.readFile(
      path.join(directory, file),
      { encoding: 'utf8' }
    );

    let updatedFileContent = fileContent;

    for (const pattern of patternsToTest) {
      const matches = fileContent.matchAll(pattern);

      if (matches.length === 0) {
        continue;
      }

      let needToReplace = false;

      for (const match of matches) {
        if (semver.lte(latestVersion, match.groups.version)) {
          continue;
        }

        needToReplace = true;

        matchesFound.push({
          current: match.groups.version,
          latest: latestVersion,
          location: file
        });
      }

      if (replace && needToReplace) {
        updatedFileContent = updatedFileContent.replace(
          pattern,
          (match, p1) => match.replace(p1, latestVersion)
        );
      }
    }

    if (replace && updatedFileContent !== fileContent) {
      await fs.writeFile(
        path.join(directory, file),
        updatedFileContent,
        { encoding: 'utf8' }
      );
    }
  }

  return matchesFound;
};

module.exports = findOutdatedNodeVersionReferences;
