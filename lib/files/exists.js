'use strict';

const fs = require('fs');

const exists = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  try {
    await fs.promises.access(path, fs.constants.R_OK);
  } catch {
    return false;
  }

  return true;
};

module.exports = exists;
