import { buntstift } from 'buntstift';
import { fileURLToPath } from 'url';
import path from 'path';
import { Worker } from 'worker_threads';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const dirname = path.dirname(fileURLToPath(import.meta.url));

class TestRunner {
  protected applicationRoot: string;

  protected types: string[];

  protected bail: boolean;

  protected worker: Worker | undefined;

  public constructor ({ applicationRoot, types, bail = true }: {
    applicationRoot: string;
    types: string[];
    bail?: boolean;
  }) {
    this.applicationRoot = applicationRoot;
    this.types = types;
    this.bail = bail;
    this.worker = undefined;
  }

  public async run (): Promise<Result<undefined, errors.TestsFailed>> {
    this.worker = new Worker(path.join(dirname, '..', 'steps', 'test', 'testWorker.js'), {
      workerData: {
        applicationRoot: this.applicationRoot,
        types: this.types,
        bail: this.bail
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
    buntstift.info('Aborting current test run... Ongoing tests will be finished.');

    if (this.worker) {
      await this.worker.terminate();
    }
  }
}

export {
  TestRunner
};
