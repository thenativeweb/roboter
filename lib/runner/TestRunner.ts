import { buntstift } from 'buntstift';
import { fileURLToPath } from 'url';
import path from 'path';
import { Worker } from 'worker_threads';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const dirname = path.dirname(fileURLToPath(import.meta.url));

class TestRunner {
  protected applicationRoot: string;

  protected bail: boolean;

  protected watch: boolean;

  protected worker: Worker | undefined;

  protected previousRunResult?: 'success' | 'fail' | 'bail';

  protected runNumber: number;

  public constructor ({ applicationRoot, bail, watch }: {
    applicationRoot: string;
    bail: boolean;
    watch: boolean;
  }) {
    this.applicationRoot = applicationRoot;
    this.bail = bail;
    this.watch = watch;
    this.worker = undefined;
    this.runNumber = 0;
  }

  public async run ({ absoluteTestFilesPerType, typeSequence, grep }: {
    absoluteTestFilesPerType: Record<string, string[]>;
    typeSequence: string[];
    grep?: RegExp;
  }): Promise<Result<undefined, errors.TestsFailed | errors.TypeScriptCompilationFailed>> {
    this.worker = new Worker(path.join(dirname, '..', 'steps', 'test', 'testWorker.js'), {
      workerData: {
        applicationRoot: this.applicationRoot,
        absoluteTestFilesPerType,
        typeSequence,
        bail: this.bail,
        watch: this.watch,
        grep,
        previousRunResult: this.previousRunResult,
        runNumber: this.runNumber
      }
    });

    this.runNumber += 1;

    let result: Result<undefined, errors.TestsFailed> = error(new errors.TestsFailed());

    const terminateWorker = async (): Promise<void> => {
      await this.worker!.terminate();
    };

    process.on('SIGTERM', terminateWorker);

    try {
      await new Promise<void>((resolve, reject): void => {
        this.worker!.once('message', async (message): Promise<void> => {
          if (message === 'success') {
            this.previousRunResult = 'success';
            result = value();
          } else if (message === 'bail') {
            this.previousRunResult = 'bail';
          } else {
            this.previousRunResult = 'fail';
          }

          this.worker!.stdout.once('end', terminateWorker);
          this.worker!.stderr.once('end', terminateWorker);
          setTimeout(terminateWorker, 30_000);
        });
        this.worker!.once('error', (workerError): void => {
          reject(workerError);
        });
        this.worker!.once('exit', async (): Promise<void> => {
          resolve();
        });
      });

      process.off('SIGTERM', terminateWorker);

      return result;
    } catch (ex: unknown) {
      if (typeof ex === 'object' && ex !== null && 'diagnosticCodes' in ex) {
        return error(new errors.TypeScriptCompilationFailed({ cause: ex as Error, message: (ex as any).message }));
      }

      throw ex;
    }
  }

  public async abort (): Promise<void> {
    buntstift.line();
    buntstift.info('Aborting current test run...');

    if (this.worker) {
      await this.worker.terminate();
    }
  }
}

export {
  TestRunner
};
