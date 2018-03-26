'use strict';

const path = require('path');

const shell = require('shelljs');

const runRoboterTask = async function ({ cwd, task, directory }) {
  if (!cwd) {
    throw new Error('Cwd is missing.');
  }
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  let args;

  try {
    /* eslint-disable global-require */
    args = require(path.join(directory, 'args.js'));
    /* eslint-enable global-require */
  } catch (ex) {
    args = {};
  }

  let env;

  try {
    /* eslint-disable global-require */
    env = require(path.join(directory, 'env.js'));
    /* eslint-enable global-require */
  } catch (ex) {
    env = {};
  }

  /* eslint-disable no-process-env */
  env = Object.assign({}, process.env, env);
  /* eslint-enable no-process-env */

  let argsAsString = args;

  if (typeof args === 'object') {
    argsAsString = Object.
      keys(args).
      map(arg => {
        const value = args[arg];

        if (typeof value === 'boolean') {
          return `--${arg}`;
        }

        return `--${arg} ${args[arg]}`;
      }).
      join(' ');
  }

  const pathToCli = path.join(cwd, '..', '..', 'lib', 'bin', 'roboter.js');

  const { code, stderr, stdout } = shell.exec(`node ${pathToCli} ${task} ${argsAsString}`, {
    cwd: directory,
    env
  });

  return {
    exitCode: code,
    stderr,
    stdout
  };
};

module.exports = runRoboterTask;
