import fs from 'fs';

const getSubDirectoryNames = async function ({ directory }: {
  directory: string;
}): Promise<string[]> {
  const directoryContents = await fs.promises.readdir(directory, { withFileTypes: true });

  return directoryContents.
    filter((dirent): boolean => dirent.isDirectory()).
    map((dirent): string => dirent.name);
};

export {
  getSubDirectoryNames
};
