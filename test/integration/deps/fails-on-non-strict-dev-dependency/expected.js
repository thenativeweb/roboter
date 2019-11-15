'use strict';

const exitCode = 1;

const stdout = [
  'Running strict dependencies check...',
  'Name   Version  Type',
  '─────  ───────  ───────────────',
  'noop3  ^13.7.2  devDependencies'
];

const stderr = 'Non-strict dependencies found.';

module.exports = { exitCode, stdout, stderr };
