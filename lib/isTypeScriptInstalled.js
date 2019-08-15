'use strict';

const path = require('path');

const files = require('./files');

const isTypeScriptInstalled = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const tsConfigPath = path.join(directory, 'tsconfig.json');

  return await files.exists({ path: tsConfigPath });
};

module.exports = isTypeScriptInstalled;
