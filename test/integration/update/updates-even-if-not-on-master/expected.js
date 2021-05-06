'use strict';

const fs = require('fs').promises,
      path = require('path');

const { assert } = require('assertthat'),
      { stripIndent } = require('common-tags'),
      semver = require('semver');

const getLatestVersion = require('../../../../lib/steps/dependencies/getLatestNodeLtsVersion');

const exitCode = 0;

const stdout = [
  'some-branch',
  'Updated Node.js version(s):',
  '>=8 <10',
  'package.json'
];

const stderr = '';

const validate = async function ({ directory }) {
  const latestVersion = await getLatestVersion();
  const constraint = `>=${latestVersion} <${semver.inc(latestVersion, 'major')}`;

  /* eslint-disable global-require */
  const packageJson = await fs.readFile(path.join(directory, 'package.json'), { encoding: 'utf-8' });
  /* eslint-enable global-require */

  const newPackageJson = stripIndent`
  {
    "name": "test-package",
    "version": "0.0.1",
    "engines": {
      "node": "${constraint}"
    }
  }`;

  assert.that(packageJson).is.startingWith(`${newPackageJson}\n`);
};

module.exports = { exitCode, stdout, stderr, validate };
