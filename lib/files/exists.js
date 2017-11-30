'use strict';

const fs = require('fs');

const promisify = require('util.promisify');

const access = promisify(fs.access);

const exists = async function ({ path }) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  try {
    await access(path, fs.constants.R_OK);
  } catch (ex) {
    return false;
  }

  return true;
};

module.exports = exists;
