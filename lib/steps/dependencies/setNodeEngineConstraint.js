'use strict';

const fs = require('fs').promises,
      path = require('path');

const setNodeEngineConstraint = async ({ directory, constraint }) => {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!constraint) {
    throw new Error('Constraint is missing.');
  }

  const packageJsonPath = path.join(directory, 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath);
  const packageJson = JSON.parse(packageJsonContent);

  packageJson.engines = packageJson.engines || {};
  packageJson.engines.node = constraint;

  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  return packageJson.engines.node;
};

module.exports = setNodeEngineConstraint;
