'use strict';

const path = require('path');

const fs = require('fs-extra');

const getSubDirectories = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const directories = await fs.readdir(directory);

  const results = [];

  for (let i = 0; i < directories.length; i++) {
    const subDirectory = directories[i];
    const fileStat = await fs.stat(path.join(directory, subDirectory));

    if (fileStat.isDirectory()) {
      results.push(subDirectory);
    }
  }

  return results;
};

module.exports = getSubDirectories;
