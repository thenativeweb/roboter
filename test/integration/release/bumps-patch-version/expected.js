'use strict';

const path = require('path');

const assert = require('assertthat').default,
      isolated = require('isolated').default,
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

  assert.that(packageJson.version).is.equalTo('0.0.2');
};

module.exports = { exitCode, stdout, stderr, validate };
