'use strict';

const fs = require('fs').promises,
      path = require('path');

const exists = require('../../lib/files/exists');

const addPackageDependency = async function ({ directory, dependencyName, dependencyTarget }) {
  if (!directory) {
    throw new Error('Directory is missing');
  }
  if (!dependencyName) {
    throw new Error('Dependency name is missing.');
  }
  if (!dependencyTarget) {
    throw new Error('Dependency target is missing');
  }

  const packageJsonPath = path.join(directory, 'package.json');
  let packageJsonContent;

  if (await exists({ path: packageJsonPath })) {
    packageJsonContent = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  }

  if (!packageJsonContent.dependencies) {
    packageJsonContent.dependencies = {};
  }

  packageJsonContent.dependencies[dependencyName] = dependencyTarget;

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJsonContent), 'utf8');
};

module.exports = addPackageDependency;
