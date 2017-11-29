'use strict';

const fs = require('fs'),
      path = require('path');

const promisify = require('util.promisify');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

const getSubDirectories = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const directories = await readdir(directory);

  const results = [];

  for (let i = 0; i < directories.length; i++) {
    const subDirectory = directories[i];
    const fileStat = await stat(path.join(directory, subDirectory));

    if (fileStat.isDirectory()) {
      results.push(subDirectory);
    }
  }

  return results;
};

module.exports = getSubDirectories;
