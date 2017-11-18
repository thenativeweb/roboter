'use strict';

const defekt = require('defekt');

const errors = defekt([
  'CodeMalformed',
  'TestsFailed'
]);

module.exports = errors;
