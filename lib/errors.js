'use strict';

const defekt = require('defekt');

const errors = defekt([
  'CodeMalformed',
  'ExecutableFailed',
  'TestsFailed',
  'TestsMissing'
]);

module.exports = errors;
