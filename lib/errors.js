'use strict';

const defekt = require('defekt');

const errors = defekt([
  'CodeMalformed',
  'ExecutableFailed',
  'LicenseIncompatible',
  'LicenseNotSupported',
  'LocalMasterBehindRemote',
  'PackageJsonMissing',
  'PendingChanges',
  'TestsFailed',
  'TestsMissing',
  'UnusedDependencies'
]);

module.exports = errors;
