'use strict';

const execa = require('execa'),
      processenv = require('processenv');

const execLive = async function (command, options = {}) {
  if (!command) {
    throw new Error('Command is missing.');
  }

  const cwd = options.cwd || process.cwd(),
        env = options.env || processenv(),
        maxBuffer = options.maxBuffer || 1024 * 200;

  const [ binary, ...args ] = command.split(' ');

  const childProcess = execa(binary, args, { cwd, env, maxBuffer });

  if (!options.silent) {
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
  }

  return await childProcess;
};

module.exports = execLive;
