import { LinterResult } from 'npm-package-json-lint';

const formatPackageJsonLintResults = function ({ packageJsonLintResult }: {
  packageJsonLintResult: LinterResult;
}): string {
  let formattedResult = '';

  for (const fileResult of packageJsonLintResult.results) {
    formattedResult += `${fileResult.filePath}\n`;
    for (const issue of fileResult.issues) {
      formattedResult += `  ${issue.severity.padEnd(7)}  ${issue.lintMessage}  (${issue.node})\n`;
    }
    formattedResult += '\n';
  }

  formattedResult += `✖ ${packageJsonLintResult.errorCount + packageJsonLintResult.warningCount} problems (${packageJsonLintResult.errorCount} errors, ${packageJsonLintResult.warningCount} warnings)\n`;

  return formattedResult;
};

export {
  formatPackageJsonLintResults
};
