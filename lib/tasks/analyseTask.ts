import { buntstift } from 'buntstift';
import { lintCode } from '../steps/analyse/lintCode';
import { lintPackageJson } from '../steps/analyse/lintPackageJson';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const analyseTask = async function ({ applicationRoot }: {
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

  buntstift.line();
  buntstift.success('Code analysis successful.');

  return value();
};

export {
  analyseTask
};
