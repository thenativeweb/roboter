import { buntstift } from 'buntstift';
import { fileURLToPath } from 'url';
import path from 'path';
import { waitForSignals } from 'wait-for-signals';
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
  }): Promise<Result<undefined, errors.TestsFailed>> {
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
    const collector = waitForSignals({ count: 3 });

    this.worker.once('message', async (message): Promise<void> => {
      if (message === 'success') {
        this.previousRunResult = 'success';
        result = value();
        await collector.signal();

        return;
      }

      if (message === 'bail') {
        this.previousRunResult = 'bail';
      } else {
        this.previousRunResult = 'fail';
      }

      await collector.signal();
    });
    this.worker.once('error', (workerError): void => {
      throw workerError;
    });
    this.worker.stdout.on('end', async (): Promise<void> => {
      await collector.signal();
    });
    this.worker.stderr.on('end', async (): Promise<void> => {
      await collector.signal();
    });

    await collector.promise;

    return result;
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
