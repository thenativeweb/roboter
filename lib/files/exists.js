'use strict';

const { promises: fs, constants } = require('fs');

const exists = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  try {
    await fs.access(path, constants.R_OK);
  } catch {
    return false;
  }

  return true;
};

module.exports = exists;
