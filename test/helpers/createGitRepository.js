'use strict';

const fs = require('fs'),
      path = require('path'),
      { promisify } = require('util');

const isolated = require('isolated'),
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const writeFile = promisify(fs.writeFile);

const createGitRepository = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const gitIgnorePath = path.join(directory, '.gitignore');

  await writeFile(gitIgnorePath, stripIndent`
    node_modules
  `, { encoding: 'utf8' });

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
