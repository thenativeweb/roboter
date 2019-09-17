'use strict';

const depcheck = require('depcheck');

const errors = require('../../errors');

const checkForUnusedDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const depcheckOptions = {
    ignoreDirs: [ 'node_modules' ],
    ignoreMatches: [ '@types/*', 'roboter' ],
    parsers: {
      '*.js': depcheck.parser.es6,
      '*.jsx': depcheck.parser.jsx,
      '*.ts': depcheck.parser.typescript,
      '*.tsx': depcheck.parser.typescript
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

  const {
    invalidDirs,
    invalidFiles,
    dependencies,
    devDependencies
  } = await depcheck(directory, depcheckOptions);

  if (invalidFiles.length > 0) {
    throw new errors.FileParsingFailed(`Unable to parse some files: ${invalidFiles.join(', ')}`);
  }

  if (invalidDirs.length > 0) {
    throw new errors.DirectoryAccessFailed(`Unable to access some directories: ${invalidDirs.join(', ')}`);
  }

  if (dependencies.length > 0 || devDependencies.length > 0) {
    const allUnusedDeps = dependencies.concat(devDependencies);

    throw new errors.UnusedDependencies(`The following dependencies are unused or missing:\n\n${allUnusedDeps.join(',\n')}`);
  }
};

module.exports = checkForUnusedDependencies;
