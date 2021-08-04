import fs from 'fs';

const cleanupGlobalRoboterTestData = async function ({
  absoluteRoboterPackageFile,
  absoluteNpmCacheDirectory
}: {
  absoluteRoboterPackageFile: string;
  absoluteNpmCacheDirectory: string;
}): Promise<void> {
  try {
    await fs.promises.rm(absoluteNpmCacheDirectory, { recursive: true });
    await fs.promises.rm(absoluteRoboterPackageFile, { recursive: true });
  } catch {
    // We don't care if this doesn't work. This is just convenience cleanup for
    // local development.
  }
};

export {
  cleanupGlobalRoboterTestData
};
