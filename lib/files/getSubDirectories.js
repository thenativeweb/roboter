'use strict';

const fs = require('fs').promises,
      path = require('path');

const getSubDirectories = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const directories = await fs.readdir(directory);

  const results = [];

  for (const subDirectory of directories) {
    const fileStat = await fs.stat(path.join(directory, subDirectory));

    if (fileStat.isDirectory()) {
      results.push(subDirectory);
    }
  }

  return results;
};

module.exports = getSubDirectories;
