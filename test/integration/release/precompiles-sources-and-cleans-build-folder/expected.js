'use strict';

const path = require('path');

const assert = require('assertthat'),
      isolated = require('isolated'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/build/ ${tempDirectory}`);

  const ls = shell.ls(path.join(tempDirectory, 'build'));

  assert.that(ls.length).is.equalTo(2);
  assert.that(ls[0]).is.equalTo('index.d.ts');
  assert.that(ls[1]).is.equalTo('index.js');
};

module.exports = { exitCode, stdout, stderr, validate };
