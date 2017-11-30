'use strict';

const fs = require('fs');

const promisify = require('util.promisify');

const access = promisify(fs.access);

const exists = async function ({ file }) {
  if (!file) {
    throw new Error('File is missing.');
  }

  try {
    await access(file, fs.constants.R_OK);
  } catch (ex) {
    return false;
  }

  return true;
};

module.exports = exists;
