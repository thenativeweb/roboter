import dotenv from 'dotenv';
import { fileExists } from '../../utils/fileExists';
import fs from 'fs';
import path from 'path';

const loadEnvironmentVariables = async function ({ directory }: {
  directory: string;
}): Promise<NodeJS.ProcessEnv> {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const dotenvFilePath = path.join(directory, '.env');
  let environmentVariables = {};

  if (await fileExists({ absoluteFile: dotenvFilePath })) {
    const dotenvContent = await fs.promises.readFile(dotenvFilePath, { encoding: 'utf8' });

    environmentVariables = dotenv.parse(dotenvContent);
  }

  return environmentVariables;
};

export {
  loadEnvironmentVariables
};
