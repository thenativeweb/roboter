'use strict';

const defekt = require('defekt').default;

const errors = defekt({
  BuildFailed: {},
  CodeAnalysisFailed: {},
  CodeMalformed: {},
  ExecutableFailed: {},
  LicenseIncompatible: {},
  LicenseNotSupported: {},
  LocalMasterBehindRemote: {},
  NoCodeFound: {},
  NotOnLocalMaster: {},
  OutdatedDependencies: {},
  PackageJsonMissing: {},
  PendingChanges: {},
  TestsFailed: {},
  TestsMissing: {},
  TypeScriptCompilationFailed: {},
  TypeScriptOutputNotConfigured: {},
  UnusedDependencies: {}
});

module.exports = errors;
