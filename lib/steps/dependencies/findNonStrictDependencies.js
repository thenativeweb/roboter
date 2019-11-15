'use strict';

const fs = require('fs').promises,
      path = require('path');

const getNonStrictDependencies = function ({ packageJson, type }) {
  if (!packageJson) {
    throw new Error('Package json is missing.');
  }
  if (!type) {
    throw new Error('Type is missing.');
  }

  const nonStrictDependencies = [];

  if (!packageJson[type]) {
    return nonStrictDependencies;
  }

  for (const [ name, version ] of Object.entries(packageJson[type])) {
    // Only check for ^ and ~ in the beginning of a version number to anticipate
    // the usual npm non-strict mode problems. If someone actually explicitly
    // uses a range or a wildcard (or also a link to GitHub) as version, this
    // should be fine. The goal of this step is to find the accidental errors,
    // not to punish users for explicit decisions.
    if (version.startsWith('^') || version.startsWith('~')) {
      nonStrictDependencies.push({ name, version, type });
    }
  }

  return nonStrictDependencies;
};

const findNonStrictDependencies = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const packageJsonContent = await fs.readFile(path.join(directory, 'package.json'));
  const packageJson = JSON.parse(packageJsonContent);

  const dependencies = getNonStrictDependencies({
    packageJson,
    type: 'dependencies'
  });

  const devDependencies = getNonStrictDependencies({
    packageJson,
    type: 'devDependencies'
  });

  return [ ...dependencies, ...devDependencies ];
};

module.exports = findNonStrictDependencies;
