'use strict';

const fs = require('fs');

const promisify = require('util.promisify');

const readFile = promisify(fs.readFile);

const read = async function (path, options = {}) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  const encoding = options.encoding || 'utf8';

  return await readFile(path, { encoding });
};

module.exports = read;
