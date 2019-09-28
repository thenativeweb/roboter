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
  GitFailed: {},
  GitNotInReleasableState: {},
  GitNotInUpdateableState: {},
  LicenseCheckFailed: {},
  LicenseIncompatible: {},
  LicenseNotSupported: {},
  LocalBranchBehindRemote: {},
  NoCodeFound: {},
  NoNodeEngineInPackageJsonFound: {},
  NotOnExpectedBranch: {},
  OutdatedDependencies: {},
  OutdatedNodeReference: {},
  PackageJsonMissing: {},
  PendingChanges: {},
  ReleaseTypeInvalid: {},
  StepExecutionFailed: {},
  TestsFailed: {},
  TypeScriptCompilationFailed: {},
  TypeScriptOutputConfigurationMissing: {},
  UnusedDependencies: {}
});

module.exports = errors;
