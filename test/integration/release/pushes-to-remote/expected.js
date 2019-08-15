'use strict';

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  // TODO: @Hannes ... another one where I'm unsure how to solve it.
  // const listRemoteTags = shell.exec('git ls-remote --refs --tags origin', { cwd: directory });
  // const remoteTags = listRemoteTags.stdout.split('\n');
  // const [ firstRemoteTag ] = remoteTags;
  //
  // assert.that(firstRemoteTag).is.containing('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
