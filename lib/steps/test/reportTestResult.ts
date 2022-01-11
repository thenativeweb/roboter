import { buntstift } from 'buntstift';
import { isCustomError, Result } from 'defekt';
import * as errors from '../../errors';

const reportTestResult = function ({ testResult }: {
  testResult: Result<undefined, errors.TestsFailed | errors.TypeScriptCompilationFailed>;
}): void {
  if (testResult.hasError()) {
    if (isCustomError(testResult.error, errors.TypeScriptCompilationFailed)) {
      buntstift.warn(testResult.error.message);
      buntstift.error('TypeScript compilation failed.');
    } else {
      buntstift.error('Tests failed.');
    }
  }
};

export {
  reportTestResult
};
