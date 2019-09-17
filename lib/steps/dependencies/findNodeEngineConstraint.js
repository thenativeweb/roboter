'use strict';

const fs = require('fs').promises,
      path = require('path');

const errors = require('../../errors');

const findNodeEngineConstraint = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const packageJsonContent = await fs.readFile(path.join(directory, 'package.json'));
  const packageJson = JSON.parse(packageJsonContent);

  if (packageJson.engines === undefined || packageJson.engines.node === undefined) {
    throw new errors.NoNodeEngineInPackageJsonFound();
  }

  return packageJson.engines.node;
};

module.exports = findNodeEngineConstraint;
