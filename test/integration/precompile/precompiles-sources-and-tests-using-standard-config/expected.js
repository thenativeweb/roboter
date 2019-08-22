'use strict';

const isolated = require('isolated'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/build/src/index.js ${tempDirectory}`);
  shell.exec(`docker cp ${container}:/home/node/app/build/test/indexTest.js ${tempDirectory}`);
};

module.exports = { exitCode, stdout, stderr, validate };
