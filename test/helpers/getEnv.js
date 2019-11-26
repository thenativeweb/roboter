'use strict';

const path = require('path');

const getEnv = function ({ directory }) {
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

  return env;
};

module.exports = getEnv;
