import { buntstift } from 'buntstift';
import { lintCode } from '../steps/analyse/lintCode';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const analyseTask = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.AnalysisFailed>> {
  buntstift.line();
  buntstift.info(`Running code analysis...`, { prefix: '▸' });

  const stopWaiting = buntstift.wait();

  const lintCodeResult = await lintCode({ applicationRoot });

  stopWaiting();

  if (lintCodeResult.hasValue()) {
    buntstift.line();
    buntstift.success('Code analysis successful.');

    return value();
  }

  switch (lintCodeResult.error.code) {
    case errors.CodeMalformed.code: {
      buntstift.raw(`${lintCodeResult.error.message}\n`);
      buntstift.error('Malformed code found.');

      return error(new errors.AnalysisFailed({
        message: 'Code analysis failed.', cause: lintCodeResult.error
      }));
    }
    default: {
      buntstift.error('Failed to run code analysis.');
      throw lintCodeResult.error;
    }
  }
};

export {
  analyseTask
};
