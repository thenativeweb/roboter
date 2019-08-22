'use strict';

const path = require('path');

const getEnvListAsDockerParameters = function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  let env;

  try {
    /* eslint-disable global-require */
    env = require(path.join(directory, 'env.js'));
    /* eslint-enable global-require */
  } catch {
    env = {};
  }

  const envList = Object.entries(env).
    map(([ envName, envValue ]) => `-e ${envName}=${envValue}`).
    join(' ');

  return envList;
};

module.exports = getEnvListAsDockerParameters;
