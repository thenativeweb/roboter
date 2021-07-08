import { cleanupFixture } from './cleanupFixture';
import { Fixture } from './Fixture';
import { loadFixture } from './loadFixture';

const testWithFixture = function (title: string, fixturePath: string[], testCallback: (fixture: Fixture) => Promise<void>): void {
  test(title, async function (): Promise<void> {
    const {
      absoluteRoboterPackageFile,
      absoluteNpmCacheDirectory
    } = this.roboter;

    const fixture = (await loadFixture({ fixturePath, absoluteRoboterPackageFile, absoluteNpmCacheDirectory })).unwrapOrThrow();

    try {
      await testCallback(fixture);
    } finally {
      await cleanupFixture({ fixture });
    }
  });
};

// eslint-disable-next-line mocha/no-exports
export {
  testWithFixture
};
