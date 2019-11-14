'use strict';

const { processenv } = require('processenv'),
      shell = require('shelljs');

const errors = require('./errors'),
      ui = require('./cli/ui');

const runCommand = async function (command, options = {}) {
  if (!command) {
    throw new Error('Command is missing.');
  }

  const cwd = options.cwd || process.cwd(),
        env = options.env || processenv(),
        maxBuffer = options.maxBuffer || 1024 * 200,
        silent = options.silent || false;

  return new Promise((resolve, reject) => {
    try {
      const childProcess = shell.exec(command, { cwd, env, maxBuffer, silent: true }, (exitCode, stdout, stderr) => {
        if (exitCode !== 0) {
          const ex = new errors.ExecutableFailed(stderr);

          ex.exitCode = exitCode;
          ex.stdout = stdout;
          ex.stderr = stderr;

          return reject(ex);
        }

        resolve({ exitCode, stdout, stderr });
      });

      if (!silent) {
        childProcess.stdout.on('data', data => ui.passThrough(data));
        childProcess.stderr.on('data', data => ui.passThrough(data, { target: 'stderr' }));
      }
    } catch (ex) {
      reject(ex);
    }
  });
};

module.exports = runCommand;
