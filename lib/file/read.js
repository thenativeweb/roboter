'use strict';

const fs = require('fs-extra');

const read = async function (path, options = {}) {
  if (!path) {
    throw new Error('Path is missing.');
  }

  const encoding = options.encoding || 'utf8';

  return await fs.readFile(path, { encoding });
};

module.exports = read;
