'use strict';

const globby = require('globby');

const fileCandidatesForNodeVersionCheck = async function () {
  return [
    ...await globby('**/Dockerfile', { gitignore: true }),
    '.circleci/config.yml',
    '.dependabot/config.yml'
  ];
};

module.exports = fileCandidatesForNodeVersionCheck;
