import { Readable } from 'stream';
import * as testErrors from './errors';

const waitForStringInStream = async function ({ stream, string, timeout: millisecondsUntilTimeout }: {
  stream: Readable;
  string: string;
  timeout?: number;
}): Promise<void> {
  let accumulator = '';

  const accumulateChunks = (chunk: string): void => {
    accumulator += chunk;
  };

  stream.on('data', accumulateChunks);

  await new Promise<void>((resolve, reject): void => {
    let timeout: NodeJS.Timeout;

    const resolveWhenAccumulatorContainsString = (): void => {
      if (accumulator.includes(string)) {
        clearTimeout(timeout);
        stream.off('data', resolveWhenAccumulatorContainsString);
        stream.off('data', accumulateChunks);
        resolve();
      }
    };

    timeout = setTimeout(
      (): void => {
        stream.off('data', resolveWhenAccumulatorContainsString);
        stream.off('data', accumulateChunks);
        reject(new testErrors.WaitForStringInStreamTimeout());
      },
      millisecondsUntilTimeout
    );

    stream.on('data', resolveWhenAccumulatorContainsString);
  });
};

export {
  waitForStringInStream
};
