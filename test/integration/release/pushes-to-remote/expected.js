'use strict';

const { assert } = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ repository }) {
  const listTags = shell.ls(`${repository}/refs/tags`);

  const tags = listTags.stdout.split('\n');

  assert.that(tags[0]).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
