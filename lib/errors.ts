import { defekt } from 'defekt';

class AnalysisFailed extends defekt({ code: 'AnalysisFailed' }) {}
class ApplicationNotFound extends defekt({ code: 'ApplicationNotFound' }) {}
class BuildFailed extends defekt({ code: 'BuildFailed' }) {}
class CannotImplicitlyRemoveRoots extends defekt({ code: 'CannotImplicitlyRemoveRoots' }) {}
class CodeMalformed extends defekt({ code: 'CodeMalformed' }) {}
class CouldNotAnalyzeSourceFile extends defekt({ code: 'CouldNotAnalyzeSourceFile' }) {}
class DependencyCheckFailed extends defekt({ code: 'DependencyCheckFailed' }) {}
class DirectoryAccessFailed extends defekt({ code: 'DirectoryAccessFailed' }) {}
class DirectoryNotFound extends defekt({ code: 'DirectoryNotFound' }) {}
class EdgeAlreadyInGraph extends defekt({ code: 'EdgeAlreadyInGraph' }) {}
class EdgeNotInGraph extends defekt({ code: 'EdgeNotInGraph' }) {}
class ExecutableFailed extends defekt({ code: 'ExecutableFailed' }) {
  public readonly command: string;

  public readonly exitCode: number;

  public readonly stdout: string;

  public readonly stderr: string;

  public constructor (
    message: string,
    command: string,
    exitCode: number,
    stdout: string,
    stderr: string
  ) {
    super(message);
    this.command = command;
    this.exitCode = exitCode;
    this.stdout = stdout;
    this.stderr = stderr;
  }
}
class FileParsingFailed extends defekt({ code: 'FileParsingFailed' }) {}
class GitFailed extends defekt({ code: 'GitFailed' }) {}
class GitNotInReleasableState extends defekt({ code: 'GitNotInReleasableState' }) {}
class GitNotInUpdateableState extends defekt({ code: 'GitNotInUpdateableState' }) {}
class LicenseCheckConfigurationNotFound extends defekt({ code: 'LicenseCheckConfigurationNotFound' }) {}
class LicenseCheckConfigurationMalformed extends defekt({ code: 'LicenseCheckConfigurationMalformed' }) {}
class LicenseCheckFailed extends defekt({ code: 'LicenseCheckFailed' }) {}
class LicenseDeprecated extends defekt({ code: 'LicenseDeprecated' }) {}
class LicenseIncompatible extends defekt({ code: 'LicenseIncompatible' }) {}
class LicenseNotFound extends defekt({ code: 'LicenseNotFound' }) {}
class LicenseNotSupported extends defekt({ code: 'LicenseNotSupported' }) {}
class LocalBranchBehindRemote extends defekt({ code: 'LocalBranchBehindRemote' }) {}
class NoCodeFound extends defekt({ code: 'NoCodeFound' }) {}
class NodeNotInGraph extends defekt({ code: 'NodeNotInGraph' }) {}
class NonStrictDependencyFound extends defekt({ code: 'NonStrictDependencyFound' }) {}
class NotOnExpectedBranch extends defekt({ code: 'NotOnExpectedBranch' }) {}
class OutdatedDependencies extends defekt({ code: 'OutdatedDependencies' }) {}
class OutdatedNodeReference extends defekt({ code: 'OutdatedNodeReference' }) {}
class PackageJsonMalformed extends defekt({ code: 'PackageJsonMalformed' }) {}
class PackageJsonMissing extends defekt({ code: 'PackageJsonMissing' }) {}
class PackageNotFound extends defekt({ code: 'PackageNotFound' }) {}
class PendingChanges extends defekt({ code: 'PendingChanges' }) {}
class RootAlreadyInGraph extends defekt({ code: 'RootAlreadyInGraph' }) {}
class RootNotInGraph extends defekt({ code: 'RootNotInGraph' }) {}
class StepExecutionFailed extends defekt({ code: 'StepExecutionFailed' }) {}
class SourceNodeNotInGraph extends defekt({ code: 'SourceNodeNotInGraph ' }) {}
class TestSetupFailed extends defekt({ code: 'TestSetupFailed' }) {}
class TestsFailed extends defekt({ code: 'TestsFailed' }) {}
class TypeScriptCompilationFailed extends defekt({ code: 'TypeScriptCompilationFailed' }) {}
class TypeScriptOutputConfigurationMissing extends defekt({ code: 'TypeScriptOutputConfigurationMissing' }) {}
class UnusedDependencies extends defekt({ code: 'UnusedDependencies' }) {}

export {
  AnalysisFailed,
  ApplicationNotFound,
  BuildFailed,
  CannotImplicitlyRemoveRoots,
  CodeMalformed,
  CouldNotAnalyzeSourceFile,
  DependencyCheckFailed,
  DirectoryAccessFailed,
  DirectoryNotFound,
  EdgeAlreadyInGraph,
  EdgeNotInGraph,
  ExecutableFailed,
  FileParsingFailed,
  GitFailed,
  GitNotInReleasableState,
  GitNotInUpdateableState,
  LicenseCheckConfigurationNotFound,
  LicenseCheckConfigurationMalformed,
  LicenseCheckFailed,
  LicenseDeprecated,
  LicenseIncompatible,
  LicenseNotFound,
  LicenseNotSupported,
  LocalBranchBehindRemote,
  NoCodeFound,
  NodeNotInGraph,
  NonStrictDependencyFound,
  NotOnExpectedBranch,
  OutdatedDependencies,
  OutdatedNodeReference,
  PackageJsonMalformed,
  PackageJsonMissing,
  PackageNotFound,
  PendingChanges,
  RootAlreadyInGraph,
  RootNotInGraph,
  StepExecutionFailed,
  SourceNodeNotInGraph,
  TestSetupFailed,
  TestsFailed,
  TypeScriptCompilationFailed,
  TypeScriptOutputConfigurationMissing,
  UnusedDependencies
};
