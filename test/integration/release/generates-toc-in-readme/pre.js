'use strict';

const isolated = require('isolated'),
      shell = require('shelljs');

const readMe = `<!-- toc -->

## Installation

## Quick start

## License`;

const pre = function (options, callback) {
  const { dirname } = options;

  shell.exec(`echo "${readMe}" > README.md`, { cwd: dirname });
  shell.exec('git init', { cwd: dirname });
  shell.exec('git add .', { cwd: dirname });
  shell.exec('git commit -m "Initial commit."', { cwd: dirname });

  isolated((err, tempDirectory) => {
    if (err) {
      return callback(err);
    }

    shell.exec(`cp -r ./ ${tempDirectory}`, { cwd: dirname });

    shell.exec(`git remote add origin ${tempDirectory}`, { cwd: dirname });

    callback(null);
  });
};

module.exports = pre;
