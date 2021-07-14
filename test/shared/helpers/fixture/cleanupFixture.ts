import { buntstift } from 'buntstift';
import { Fixture } from './Fixture';
import fs from 'fs';

const cleanupFixture = async function ({ fixture }: {
  fixture: Fixture;
}): Promise<void> {
  buntstift.verbose(`Cleaning fixture ${fixture.fixturePath.join('/')}...`);
  await fs.promises.rm(fixture.absoluteTestDirectory, { recursive: true });
};

export {
  cleanupFixture
};
