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

  protected worker: Worker | undefined;

  public constructor ({ applicationRoot, bail = true }: {
    applicationRoot: string;
    bail?: boolean;
  }) {
    this.applicationRoot = applicationRoot;
    this.bail = bail;
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
        grep
      }
    });

    return await new Promise<Result<undefined, errors.TestsFailed>>((resolve, reject): void => {
      this.worker!.once('message', (message): void => {
        if (message === true) {
          resolve(value());
        }

        resolve(error(new errors.TestsFailed()));
      });
      this.worker!.once('error', (workerError): void => {
        reject(workerError);
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
