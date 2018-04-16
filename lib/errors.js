'use strict';

const defekt = require('defekt');

const errors = defekt([
  'CodeMalformed',
  'ExecutableFailed',
  'LicenseIncompatible',
  'LicenseNotSupported',
  'LocalMasterBehindRemote',
  'NotOnLocalMaster',
  'OutdatedDependencies',
  'PackageJsonMissing',
  'PendingChanges',
  'TestsFailed',
  'TestsMissing',
  'UnusedDependencies'
]);

module.exports = errors;
