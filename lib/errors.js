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
  GitNotInReleasableState: {},
  LicenseCheckFailed: {},
  LicenseIncompatible: {},
  LicenseNotSupported: {},
  LocalMasterBehindRemote: {},
  NoCodeFound: {},
  NoNodeEngineInPackageJsonFound: {},
  NotOnLocalMaster: {},
  OutdatedDependencies: {},
  OutdatedNodeReference: {},
  PackageJsonMissing: {},
  PendingChanges: {},
  StepExecutionFailed: {},
  TestsFailed: {},
  TypeScriptCompilationFailed: {},
  TypeScriptOutputConfigurationMissing: {},
  UnusedDependencies: {}
});

module.exports = errors;
