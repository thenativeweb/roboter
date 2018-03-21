'use strict';

const shell = require('shelljs');

const helpers = require('../../../helpers');

const pre = function (options, callback) {
  const { dirname } = options;

  helpers.createGitRepository({
    dirname,
    bareRemote: false
  }).
    then(({ remoteDirectory }) => {
      shell.exec('echo "second file" > second.txt', { cwd: remoteDirectory });
      shell.exec('git add .', { cwd: remoteDirectory });
      shell.exec('git commit -m "Second commit."', { cwd: remoteDirectory });

      callback(null);
    }).
    catch(callback);
};

module.exports = pre;
