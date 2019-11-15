'use strict';

const fs = require('fs').promises,
      path = require('path');

const { assert } = require('assertthat'),
      { stripIndent } = require('common-tags'),
      { isolated } = require('isolated'),
      semver = require('semver'),
      shell = require('shelljs');

const getLatestVersion = require('../../../../lib/steps/dependencies/getLatestNodeLtsVersion');

const exitCode = 0;

const stdout = [
  'Updated Node.js version(s):',
  '>=8 <10',
  'package.json'
];

const stderr = '';

const validate = async function ({ container }) {
  const latestVersion = await getLatestVersion();
  const constraint = `>=${latestVersion} <${semver.inc(latestVersion, 'major')}`;
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/package.json ${tempDirectory}`);

  /* eslint-disable global-require */
  const packageJson = await fs.readFile(path.join(tempDirectory, 'package.json'), { encoding: 'utf-8' });
  /* eslint-enable global-require */

  const newPackageJson = stripIndent`
  {
    "name": "test-package",
    "version": "0.0.1",
    "engines": {
      "node": "${constraint}"
    }
  }`;

  assert.that(packageJson).is.equalTo(`${newPackageJson}\n`);
};

module.exports = { exitCode, stdout, stderr, validate };
