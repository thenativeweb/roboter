import fs from 'fs';

const fileExists = async function ({ absoluteFile }: {
  absoluteFile: string;
}): Promise<boolean> {
  try {
    await fs.promises.access(absoluteFile, fs.constants.R_OK);

    return true;
  } catch {
    return false;
  }
};

export {
  fileExists
};
