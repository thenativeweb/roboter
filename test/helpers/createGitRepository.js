'use strict';

const isolated = require('isolated'),
      shell = require('shelljs');

const createGitRepository = async function ({ dirname, files, bareRemote = true }) {
  if (!dirname) {
    throw new Error('Dirname is missing.');
  }

  if (Array.isArray(files)) {
    files.forEach(file => {
      shell.exec(`echo "${file.content}" > ${file.name}`, { cwd: dirname });
    });
  }

  shell.exec('git init', { cwd: dirname });
  shell.exec('git add .', { cwd: dirname });
  shell.exec('git commit -m "Initial commit."', { cwd: dirname });

  const tempDirectory = await isolated();

  if (bareRemote) {
    shell.exec(`git init --bare ${tempDirectory}`, { cwd: dirname });
    shell.exec(`git remote add origin ${tempDirectory}`, { cwd: dirname });
    shell.exec(`git push origin master`, { cwd: dirname });
  } else {
    shell.exec(`cp -r ./ ${tempDirectory}`, { cwd: dirname });
    shell.exec(`git remote add origin ${tempDirectory}`, { cwd: dirname });
  }

  return {
    remoteDirectory: tempDirectory
  };
};

module.exports = createGitRepository;
