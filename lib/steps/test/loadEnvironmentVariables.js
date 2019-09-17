'use strict';

const fs = require('fs').promises,
      path = require('path');

const dotenv = require('dotenv');

const files = require('../../files');

const loadEnvironmentVariables = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const dotenvFilePath = path.join(directory, '.env');
  let environmentVariables = {};

  if (await files.exists({ path: dotenvFilePath })) {
    const dotenvContent = await fs.readFile(dotenvFilePath, { encoding: 'utf8' });

    environmentVariables = dotenv.parse(dotenvContent);
  }

  return environmentVariables;
};

module.exports = loadEnvironmentVariables;
