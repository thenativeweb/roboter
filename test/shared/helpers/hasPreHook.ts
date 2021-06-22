import { fileExists } from '../../lib/utils/fileExists.js';
import path from 'path';

const hasPreHook = async function ({ absoluteTestDirectory }: {
  absoluteTestDirectory: string;
}): Promise<boolean> {
  return await fileExists({
    absoluteFile: path.join(absoluteTestDirectory, 'pre.js')
  });
};

export {
  hasPreHook
};
