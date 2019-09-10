'use strict';

const path = require('path');

const dotenv = require('dotenv');

const file = require('../../file'),
      files = require('../../files');

const loadEnvironmentVariables = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const dotenvFilePath = path.join(directory, '.env');
  let environmentVariables = {};

  if (await files.exists({ path: dotenvFilePath })) {
    const dotenvContent = await file.read(dotenvFilePath);

    environmentVariables = dotenv.parse(dotenvContent);
  }

  return environmentVariables;
};

module.exports = loadEnvironmentVariables;
