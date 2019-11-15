'use strict';

const path = require('path');

const { assert } = require('assertthat'),
      { isolated } = require('isolated'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/package.json ${tempDirectory}`);

  /* eslint-disable global-require */
  const packageJson = require(path.join(tempDirectory, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packageJson.version).is.equalTo('1.0.0');

  shell.exec(`docker cp ${container}:/home/node/app/.git/refs/tags ${tempDirectory}`);

  const listTags = shell.ls(`${tempDirectory}/tags`);

  const tags = listTags.stdout.split('\n');

  assert.that(tags[0]).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
