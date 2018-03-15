'use strict';

const path = require('path');

const isolated = require('isolated'),
      shell = require('shelljs');

const pre = function (options, callback) {
  shell.exec('mkdir local', { cwd: options.dirname });

  const localRepoPath = path.join(options.dirname, 'local');

  shell.exec('echo "first file" > first.txt', { cwd: localRepoPath });
  shell.exec('git init', { cwd: localRepoPath });
  shell.exec('git add .', { cwd: localRepoPath });
  shell.exec('git commit -m "Initial commit."', { cwd: localRepoPath });

  isolated((err, tempDirectory) => {
    if (err) {
      return callback(err);
    }

    shell.exec(`cp -r ./ ${tempDirectory}`, { cwd: localRepoPath });

    shell.exec('git remote add origin ../fake-remote/.git/', { cwd: tempDirectory });

    shell.exec('echo "second file" > second.txt', { cwd: tempDirectory });
    shell.exec('git add .', { cwd: tempDirectory });
    shell.exec('git commit -m "Second commit."', { cwd: tempDirectory });

    callback(null);
  });
};

module.exports = pre;

// pre({ dirname: __dirname }, () => console.log('done'));
