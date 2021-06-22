import { fileExists } from '../../utils/fileExists';
import fs from 'fs';
import path from 'path';

const getGitIgnore = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<string[]> {
  const absoluteGitIgnorePath = path.join(applicationRoot, '.gitignore');

  if (!await fileExists({ absoluteFile: absoluteGitIgnorePath })) {
    return [];
  }

  const gitIgnoreContent = await fs.promises.readFile(absoluteGitIgnorePath, 'utf-8');

  return gitIgnoreContent.split('\n');
};

export {
  getGitIgnore
};
