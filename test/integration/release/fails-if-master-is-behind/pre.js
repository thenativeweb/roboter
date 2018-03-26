'use strict';

const shell = require('shelljs');

const helpers = require('../../../helpers');

const pre = async function (options) {
  const { dirname } = options;

  const { remoteDirectory } = await helpers.createGitRepository({
    dirname,
    bareRemote: false
  });

  shell.exec('echo "second file" > second.txt', { cwd: remoteDirectory });
  shell.exec('git add .', { cwd: remoteDirectory });
  shell.exec('git commit -m "Second commit."', { cwd: remoteDirectory });
};

module.exports = pre;
