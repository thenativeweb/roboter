import { buntstift } from 'buntstift';
import { checkLicenseExpression } from '../steps/analyze/checkLicenseExpression';
import { isTypeScript } from 'is-typescript';
import { lintCode } from '../steps/analyze/lintCode';
import { lintPackageJson } from '../steps/analyze/lintPackageJson';
import { typeCheckCode } from '../steps/analyze/typeCheckCode';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const analyzeTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.AnalysisFailed>> {
  buntstift.line();
  buntstift.info(`Running code analysis...`, { prefix: '▸' });

  let stopWaiting = buntstift.wait();

  const lintPackageJsonResult = await lintPackageJson({ applicationRoot });

  stopWaiting();

  if (lintPackageJsonResult.hasError()) {
    switch (lintPackageJsonResult.error.code) {
      case errors.PackageJsonMalformed.code: {
        buntstift.raw(`${lintPackageJsonResult.error.message}\n`);
        buntstift.error('Malformed package.json found.');

        return error(new errors.AnalysisFailed());
      }
      default: {
        buntstift.error('Failed to run code analysis.');
        throw lintPackageJsonResult.error;
      }
    }
  }

  stopWaiting = buntstift.wait();

  const checkLicenseExpressionResult = await checkLicenseExpression({ applicationRoot });

  stopWaiting();

  if (checkLicenseExpressionResult.hasError()) {
    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check, default-case
    switch (checkLicenseExpressionResult.error.code) {
      case errors.LicenseNotFound.code: {
        buntstift.error('No license was found for this package.');
        buntstift.raw(`${checkLicenseExpressionResult.error.message}\n`);
        break;
      }
      case errors.LicenseNotSupported.code: {
        buntstift.error('The given license is not a valid SPDX expression.');
        buntstift.raw(`${checkLicenseExpressionResult.error.message}\n`);
        break;
      }
      case errors.LicenseDeprecated.code: {
        buntstift.error('The given license is deprecated.');
        buntstift.raw(`${checkLicenseExpressionResult.error.message}\n`);
        break;
      }
    }

    return error(new errors.AnalysisFailed());
  }

  stopWaiting = buntstift.wait();

  const lintCodeResult = await lintCode({ applicationRoot });

  stopWaiting();

  if (lintCodeResult.hasError()) {
    switch (lintCodeResult.error.code) {
      case errors.CodeMalformed.code: {
        buntstift.raw(`${lintCodeResult.error.message}\n`);
        buntstift.error('Malformed code found.');

        return error(new errors.AnalysisFailed());
      }
      default: {
        buntstift.error('Failed to run code analysis.');

        throw lintCodeResult.error;
      }
    }
  }

  if (await isTypeScript({ directory: applicationRoot })) {
    stopWaiting = buntstift.wait();

    const typeCheckCodeResult = await typeCheckCode({ applicationRoot });

    if (typeCheckCodeResult.hasError()) {
      switch (typeCheckCodeResult.error.code) {
        case errors.TypeScriptCompilationFailed.code: {
          buntstift.raw(`${typeCheckCodeResult.error.message}\n`);
          buntstift.error('Incorrectly typed code found.');

          return error(new errors.AnalysisFailed());
        }
        default: {
          buntstift.error('Failed to run type check.');

          throw typeCheckCodeResult.error;
        }
      }
    }

    stopWaiting();
  }

  buntstift.line();
  buntstift.success('Code analysis successful.');

  return value();
};

export {
  analyzeTask
};
