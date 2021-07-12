import { buntstift } from 'buntstift';
import { fileURLToPath } from 'url';
import path from 'path';
import { Worker } from 'worker_threads';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';
import has = Reflect.has;

const dirname = path.dirname(fileURLToPath(import.meta.url));

class TestRunner {
  protected applicationRoot: string;

  protected bail: boolean;

  protected watch: boolean;

  protected worker: Worker | undefined;

  protected previousRunResult?: 'success' | 'fail' | 'bail';

  public constructor ({ applicationRoot, bail, watch }: {
    applicationRoot: string;
    bail: boolean;
    watch: boolean;
  }) {
    this.applicationRoot = applicationRoot;
    this.bail = bail;
    this.watch = watch;
    this.worker = undefined;
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
        previousRunResult: this.previousRunResult
      }
    });

    return await new Promise<Result<undefined, errors.TestsFailed>>((resolve, reject): void => {
      let hasResolved = false;

      this.worker!.once('message', (message): void => {
        hasResolved = true;
        if (message === 'success') {
          this.previousRunResult = 'success';
          resolve(value());
        }
        if (message === 'bail') {
          this.previousRunResult = 'bail';
        }
        this.previousRunResult = 'fail';

        resolve(error(new errors.TestsFailed()));
      });
      this.worker!.once('error', (workerError): void => {
        reject(workerError);
      });
      this.worker!.once('exit', (): void => {
        if (!hasResolved) {
          resolve(value());
        }
      });
    });
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
