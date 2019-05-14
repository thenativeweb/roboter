'use strict';

const fs = require('fs-extra');

const write = async function (path, content, encoding = 'utf8') {
  if (!path) {
    throw new Error('Path is missing.');
  }
  if (!content) {
    throw new Error('Content is missing.');
  }

  return await fs.writeFile(path, content, encoding);
};

module.exports = write;
