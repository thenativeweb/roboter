'use strict';

const shell = require('shelljs');

const pre = async function (options) {
  const { dirname } = options;

  shell.exec('npm install --no-package-lock', { cwd: dirname, silent: false });
};

module.exports = pre;
