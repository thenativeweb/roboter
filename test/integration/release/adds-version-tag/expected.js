'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  /* eslint-disable global-require */
  const packgeJson = require(path.join(dirname, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packgeJson.version).is.equalTo('1.0.0');

  const listTags = shell.exec('git tag -l', { cwd: dirname });
  const tags = listTags.stdout.split('\n');

  assert.that(tags[0]).is.equalTo('v1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
