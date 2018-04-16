'use strict';

const shell = require('shelljs');

const helpers = require('../../../helpers');

const pre = async function (options) {
  const { dirname } = options;

  await helpers.createGitRepository({
    dirname,
    bareRemote: false
  });

  shell.exec('echo "second file" > second.txt', { cwd: dirname });
  shell.exec('git add .', { cwd: dirname });
};

module.exports = pre;
