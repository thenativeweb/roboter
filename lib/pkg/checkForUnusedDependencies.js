'use strict';

const buntstift = require('buntstift'),
      depcheck = require('depcheck');

const checkForUnusedDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

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

  await new Promise(resolve => {
    depcheck(directory, depcheckOptions, ({
      invalidDirs,
      invalidFiles,
      dependencies,
      devDependencies
    }) => {
      if (invalidFiles.length > 0) {
        buntstift.warn(`Unable to parse some files: ${invalidFiles.join(', ')}`);
      }

      if (invalidDirs.length > 0) {
        buntstift.warn(`Unable to access some dirs: ${invalidDirs.join(', ')}`);
      }

      if (dependencies.length > 0 || devDependencies.length > 0) {
        const allUnusedDeps = dependencies.concat(devDependencies);

        buntstift.warn(`You have unused dependencies:\n\n${allUnusedDeps.join(',\n')}`);
      }

      resolve();
    });
  });
};

module.exports = checkForUnusedDependencies;
