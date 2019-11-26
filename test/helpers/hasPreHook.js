'use strict';

const path = require('path');

const exists = require('../../lib/files/exists');

const hasPreHook = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  return await exists({ path: path.join(directory, 'pre.js') });
};

module.exports = hasPreHook;
