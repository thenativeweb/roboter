'use strict';

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const listRemoteTags = shell.exec('git ls-remote --refs --tags origin', { cwd: dirname });
  const remoteTags = listRemoteTags.stdout.split('\n');
  const firstRemoteTag = remoteTags[0];

  assert.that(firstRemoteTag).is.containing('v1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
