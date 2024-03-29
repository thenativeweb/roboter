#!/usr/bin/env node
'use strict';

const fs = require('fs');

const path = require('path');

const shelljs = require('shelljs');

const absoluteRoboterEntryPointPath = path.join(__dirname, 'build', 'lib', 'bin', 'roboter.js');

const args = process.argv;

if (args[0].endsWith('node') || args[0].endsWith('node.exe')) {
  args.shift();
}
if (args[0].includes('roboter')) {
  args.shift();
}

const tsNodeDirectory = path.join(require.resolve('ts-node'), '..', '..');
const result = shelljs.exec(
  `node --loader="file://${tsNodeDirectory}/esm" --experimental-specifier-resolution=node --no-warnings "${absoluteRoboterEntryPointPath}" ${args.join(' ')}`,
  {
    // eslint-disable-next-line no-process-env
    env: process.env,
    cwd: process.cwd(),
    silent: false
  }
);

process.exit(result.code);
