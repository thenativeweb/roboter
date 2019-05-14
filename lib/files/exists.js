'use strict';

const fs = require('fs-extra');

const exists = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  try {
    await fs.access(path, fs.constants.R_OK);
  } catch (ex) {
    return false;
  }

  return true;
};

module.exports = exists;
