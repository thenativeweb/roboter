'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const ls = shell.ls(path.join(dirname, 'dist'));

  assert.that(ls.length).is.equalTo(1);
  assert.that(ls[0]).is.equalTo('index.js');
};

module.exports = { exitCode, stdout, stderr, validate };
