'use strict';

const path = require('path');

const getArgsList = function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  let args;

  try {
    /* eslint-disable global-require */
    args = require(path.join(directory, 'args.js'));
    /* eslint-enable global-require */
  } catch {
    args = {};
  }

  let argsList = args;

  if (typeof argsList === 'object') {
    argsList = Object.entries(args).
      flatMap(([ argName, argValue ]) => {
        if (typeof argValue === 'boolean') {
          return [ `--${argName}` ];
        }

        return [ `--${argName}`, `${argValue}` ];
      });
  }

  return argsList;
};

module.exports = getArgsList;
