'use strict';

const isolated = require('isolated'),
      shell = require('shelljs');

const pre = function (options, callback) {
  const { dirname } = options;

  shell.exec('git init', { cwd: dirname });
  shell.exec('git add .', { cwd: dirname });
  shell.exec('git commit -m "Initial commit."', { cwd: dirname });

  isolated((err, tempDirectory) => {
    if (err) {
      return callback(err);
    }

    shell.exec(`cp -r ./ ${tempDirectory}`, { cwd: dirname });

    shell.exec(`git remote add origin ${tempDirectory}/.git/`, { cwd: dirname });

    shell.exec('echo "second file" > second.txt', { cwd: tempDirectory });
    shell.exec('git add .', { cwd: tempDirectory });
    shell.exec('git commit -m "Second commit."', { cwd: tempDirectory });

    callback(null);
  });
};

module.exports = pre;
