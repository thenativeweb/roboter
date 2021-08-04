import { cleanupFixture } from './cleanupFixture';
import { ExclusiveTestFunction } from 'mocha';
import { Fixture } from './Fixture';
import { loadFixture } from './loadFixture';

const testWithFixture = function (title: string, fixturePath: string[], testCallback: (fixture: Fixture) => Promise<void>, only?: boolean): void {
  let testFunction: ExclusiveTestFunction = test;

  if (only) {
    testFunction = test.only;
  }

  testFunction(title, async function (): Promise<void> {
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

testWithFixture.only = function (title: string, fixturePath: string[], testCallback: (fixture: Fixture) => Promise<void>): void {
  testWithFixture(title, fixturePath, testCallback, true);
};

export {
  testWithFixture
};
