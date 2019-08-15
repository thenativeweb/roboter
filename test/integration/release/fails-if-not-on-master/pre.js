'use strict';

const shell = require('shelljs');

const helpers = require('../../../helpers');

const pre = async function (options) {
  const { dirname } = options;

  await helpers.createGitRepository({ dirname });

  shell.exec('git checkout -b some-branch', { cwd: dirname });
};

module.exports = pre;
