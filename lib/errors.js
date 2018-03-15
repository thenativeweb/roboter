'use strict';

const defekt = require('defekt');

const errors = defekt([
  'CodeMalformed',
  'ExecutableFailed',
  'LicenseIncompatible',
  'LicenseNotSupported',
  'LocalMasterBehindRemote',
  'PendingChanges',
  'TestsFailed',
  'TestsMissing'
]);

module.exports = errors;
