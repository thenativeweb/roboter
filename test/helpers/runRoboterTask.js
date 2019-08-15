'use strict';

const path = require('path');

const shell = require('shelljs'),
      stripAnsi = require('strip-ansi');

const runRoboterTask = async function ({ task, directory }) {
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const transformedTask = task === 'default' ? '' : task;
  let args;

  try {
    /* eslint-disable global-require */
    args = require(path.join(directory, 'args.js'));
    /* eslint-enable global-require */
  } catch {
    args = {};
  }

  let env;

  try {
    /* eslint-disable global-require */
    env = require(path.join(directory, 'env.js'));
    /* eslint-enable global-require */
  } catch {
    env = {};
  }

  /* eslint-disable no-process-env */
  env = { ...process.env, ...env };
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

  const { code, stderr, stdout } = shell.exec(`npx roboter ${transformedTask} ${argsAsString}`, {
    cwd: directory,
    env
  });

  return {
    exitCode: code,
    stderr: stripAnsi(stderr),
    stdout: stripAnsi(stdout)
  };
};

module.exports = runRoboterTask;
