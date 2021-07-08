import fs from 'fs';

const cleanupGlobalRoboterTestData = async function ({
  absoluteRoboterPackageFile,
  absoluteNpmCacheDirectory
}: {
  absoluteRoboterPackageFile: string;
  absoluteNpmCacheDirectory: string;
}): Promise<void> {
  await fs.promises.rm(absoluteNpmCacheDirectory, { recursive: true });
  await fs.promises.rm(absoluteRoboterPackageFile, { recursive: true });
};

export {
  cleanupGlobalRoboterTestData
};
