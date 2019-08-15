'use strict';

const isolated = require('isolated'),
      shell = require('shelljs');

const createGitRepository = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  shell.exec('git init', { cwd: directory });
  shell.exec('git add .', { cwd: directory });
  shell.exec('git commit -m "Initial commit."', { cwd: directory });

  const remoteDirectory = await isolated();

  shell.exec(`git init --bare ${remoteDirectory}`, { cwd: directory });
  shell.exec(`git remote add origin ${remoteDirectory}`, { cwd: directory });
  shell.exec(`git push origin master`, { cwd: directory });

  return { remoteDirectory };
};

module.exports = createGitRepository;
