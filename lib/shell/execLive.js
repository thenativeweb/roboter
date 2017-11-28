'use strict';

const execa = require('execa'),
      getStream = require('get-stream'),
      processenv = require('processenv');

const errors = require('../errors');

const execLive = function (command, options = {}) {
  return new Promise((resolve, reject) => {
    if (!command) {
      throw new Error('Command is missing.');
    }

    const cwd = options.cwd || process.cwd(),
          env = options.env || processenv(),
          maxBuffer = options.maxBuffer || 1024 * 200;

    const [ binary, ...args ] = command.split(' ');

    const childProcess = execa(binary, args, { cwd, env, maxBuffer });

    let hasError = false;

    childProcess.catch(err => {
      hasError = true;
      reject(err);
    });

    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);

    Promise.all([
      getStream(childProcess.stdout),
      getStream(childProcess.stderr)
    ]).then(values => {
      if (hasError) {
        return;
      }
      resolve({ stdout: values[0], stderr: values[1] });
    });
  });
};

module.exports = execLive;
