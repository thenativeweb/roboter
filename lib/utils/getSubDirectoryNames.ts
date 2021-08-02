import fs from 'fs';

const getSubDirectoryNames = async function ({ directory }: {
  directory: string;
}): Promise<string[]> {
  const directoryContents = await fs.promises.readdir(directory, { withFileTypes: true });

  return directoryContents.
    filter((directoryEntry): boolean => directoryEntry.isDirectory()).
    map((directoryEntry): string => directoryEntry.name);
};

export {
  getSubDirectoryNames
};
