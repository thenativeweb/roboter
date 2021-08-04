import { Readable } from 'stream';
import * as testErrors from './errors';

const waitForStringInStream = async function ({ stream, string, timeout }: {
  stream: Readable;
  string: string;
  timeout?: number;
}): Promise<void> {
  let accumulator = '';
  const startTime = Date.now();

  const accumulateChunks = (chunk: string): void => {
    accumulator += chunk;
  };

  stream.on('data', accumulateChunks);

  await new Promise<void>((resolve, reject): void => {
    const resolveWhenAccumulatorContainsString = (): void => {
      if (accumulator.includes(string)) {
        stream.off('data', resolveWhenAccumulatorContainsString);
        stream.off('data', accumulateChunks);
        resolve();
      }

      if (timeout && Date.now() - startTime > timeout) {
        stream.off('data', resolveWhenAccumulatorContainsString);
        stream.off('data', accumulateChunks);
        reject(new testErrors.WaitForStringInStreamTimeout());
      }
    };

    stream.on('data', resolveWhenAccumulatorContainsString);
  });
};

export {
  waitForStringInStream
};
