'use strict';

const exitCode = 0;

const stdout = [
  'global pre script successful',
  'unit pre script successful',
  'unit post script successful',
  'e2e pre script successful',
  'e2e post script successful',
  'baz pre script successful',
  'baz post script successful',
  'foobar pre script successful',
  'foobar post script successful',
  'global post script successful',
];

const stderr = '';

module.exports = { exitCode, stdout, stderr };
