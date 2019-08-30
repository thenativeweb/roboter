'use strict';

const execa = require('execa'),
      processenv = require('processenv').default;

const ui = require('../cli/ui');

const execLive = async function (command, options = {}) {
  if (!command) {
    throw new Error('Command is missing.');
  }

  const cwd = options.cwd || process.cwd(),
        env = options.env || processenv(),
        maxBuffer = options.maxBuffer || 1024 * 200;

  let args,
      binary;

  if (options.args) {
    binary = command;
    ({ args } = options);
  } else {
    [ binary, ...args ] = command.split(' ');
  }
  const childProcess = execa(binary, args, { cwd, env, maxBuffer });

  if (options.silent !== true) {
    childProcess.stdout.on('data', data => ui.passThrough(data));
    childProcess.stderr.on('data', data => ui.passThrough(data, { target: 'stderr' }));
  }

  return await childProcess;
};

module.exports = execLive;
