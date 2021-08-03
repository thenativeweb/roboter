import { buntstift } from 'buntstift';
import { Fixture } from './Fixture';
import fs from 'fs';

const cleanupFixture = async function ({ fixture }: {
  fixture: Fixture;
}): Promise<void> {
  buntstift.verbose(`Cleaning fixture ${fixture.fixturePath.join('/')}...`);
  try {
    await fs.promises.rm(fixture.absoluteTestDirectory, {
      recursive: true,
      maxRetries: 10
    });
  } catch {
    // We don't care if this doesn't work. This is just convenience cleanup for
    // local development.
  }
};

export {
  cleanupFixture
};
