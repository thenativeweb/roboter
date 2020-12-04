'use strict';

const exitCode = 1;

const stdoutTest = [
  'Running strict dependencies check...',
  'Name   Version  Type',
  '─────  ───────  ────────────',
  'noop3  ^13.7.2  dependencies'
];

const stderr = 'Non-strict dependencies found.';

const validate = function ({ stdout }) {
  if (stdout.includes('TypeError: errors.NonStrictDependenciesFound is not a constructor')) {
    throw new Error('This bug should be fixed, see #464.');
  }
};

module.exports = { exitCode, stdout: stdoutTest, stderr, validate };
