import { fileExists } from '../../utils/fileExists';
import path from 'path';

const findMochaConfigurationfile = async function ({ directory }: {
  directory: string;
}): Promise<string | undefined> {
  const absolutePotentialMochaConfigurationFiles = [
    path.join(directory, '.mocharc.json'),
    path.join(directory, '.mocharc.js')
  ];

  let absoluteMochaConfigurationFile;

  for (
    const absolutePotentialMochaConfigurationFile
    of absolutePotentialMochaConfigurationFiles
  ) {
    if (await fileExists({ absoluteFile: absolutePotentialMochaConfigurationFile })) {
      absoluteMochaConfigurationFile = absolutePotentialMochaConfigurationFile;
      break;
    }
  }

  return absoluteMochaConfigurationFile;
};

export {
  findMochaConfigurationfile
};
