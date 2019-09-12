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
  LicenseCheckFailed: {},
  LicenseIncompatible: {},
  LicenseNotSupported: {},
  LocalMasterBehindRemote: {},
  NoCodeFound: {},
  NotOnLocalMaster: {},
  OutdatedDependencies: {},
  PackageJsonMissing: {},
  PendingChanges: {},
  StepExecutionFailed: {},
  TestsFailed: {},
  TypeScriptCompilationFailed: {},
  TypeScriptOutputConfigurationMissing: {},
  UnusedDependencies: {}
});

module.exports = errors;
