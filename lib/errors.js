'use strict';

const defekt = require('defekt').default;

const errors = defekt({
  AnalysisFailed: {},
  BuildFailed: {},
  CodeMalformed: {},
  DependencyCheckFailed: {},
  DirectoryAccessFailed: {},
  ExecutableFailed: {},
  FileParsingFailed: {},
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
  TypeScriptOutputConfigurationMissing: {},
  UnusedDependencies: {}
});

module.exports = errors;
