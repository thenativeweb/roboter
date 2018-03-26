'use strict';

const shell = require('shelljs');

const helpers = require('../../../helpers');

const pre = async function (options) {
  const { dirname } = options;

  await helpers.createGitRepository({
    dirname
  });

  shell.exec('npm install --no-package-lock', { cwd: dirname, silent: false });
};

module.exports = pre;
