'use strict';

const assert = require('assertthat').default,
      isolated = require('isolated').default,
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/remote/refs/tags ${tempDirectory}`);

  const listTags = shell.ls(`${tempDirectory}/tags`);

  const tags = listTags.stdout.split('\n');

  assert.that(tags[0]).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
