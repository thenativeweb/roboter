import { Fixture } from './Fixture';
import fs from 'fs';

const cleanupFixture = async function ({ fixture }: {
  fixture: Fixture;
}): Promise<void> {
  console.log(`Cleaning fixture ${fixture.fixturePath.join('/')}...`);
  await fs.promises.rm(fixture.absoluteGitDirectory, { recursive: true });
  await fs.promises.rm(fixture.absoluteTestDirectory, { recursive: true });
};

export {
  cleanupFixture
};
