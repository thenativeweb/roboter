'use strict';

const { defekt } = require('defekt');

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
  NonStrictDependencyFound: {},
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
