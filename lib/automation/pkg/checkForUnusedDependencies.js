'use strict';

const buntstift = require('buntstift'),
      depcheck = require('depcheck');

const errors = require('../../errors');

const checkForUnusedDependencies = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  ui.printTaskHeader('unused or missing dependencies check');

  const depcheckOptions = {
    ignoreDirs: [ 'node_modules' ],
    ignoreMatches: [ 'roboter' ],
    parsers: {
      '*.js': depcheck.parser.es6,
      '*.jsx': depcheck.parser.jsx
    },
    detectors: [
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration
    ],
    specials: [
      depcheck.special.babel,
      depcheck.special.bin,
      depcheck.special.eslint,
      depcheck.special.mocha,
      depcheck.special.webpack
    ]
  };

  await new Promise((resolve, reject) => {
    depcheck(directory, depcheckOptions, ({
      invalidDirs,
      invalidFiles,
      dependencies,
      devDependencies
    }) => {
      let hasErrorOccured = false;

      if (invalidFiles.length > 0) {
        hasErrorOccured = true;
        buntstift.info(`Unable to parse some files: ${invalidFiles.join(', ')}`);
      }

      if (invalidDirs.length > 0) {
        hasErrorOccured = true;
        buntstift.info(`Unable to access some dirs: ${invalidDirs.join(', ')}`);
      }

      if (dependencies.length > 0 || devDependencies.length > 0) {
        hasErrorOccured = true;
        const allUnusedDeps = dependencies.concat(devDependencies);

        buntstift.info(`Following dependencies are unused or missing:\n\n${allUnusedDeps.join(',\n')}`);
      }

      if (hasErrorOccured) {
        return reject(new errors.UnusedDependencies());
      }

      resolve();
    });
  });
};

module.exports = checkForUnusedDependencies;
