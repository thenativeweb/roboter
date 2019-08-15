'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const ls = shell.ls(path.join(dirname, 'build'));

  assert.that(ls.length).is.equalTo(2);
  assert.that(ls[0]).is.equalTo('index.d.ts');
  assert.that(ls[1]).is.equalTo('index.js');
};

module.exports = { exitCode, stdout, stderr, validate };
