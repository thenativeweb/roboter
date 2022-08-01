import { assert } from 'assertthat';
import packageJson from '../../package.json' assert { type: 'json' };
import { runCommand } from '../../lib/utils/runCommand';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('default', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'prints usage when help flag is set.',
    [ 'empty-project' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter --help', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { stdout } = roboterResult.unwrapOrThrow();

      assert.that(stdout).is.containing('roboter');
      assert.that(stdout).is.containing('Synopsis');
      assert.that(stdout).is.containing('Options');
      assert.that(stdout).is.containing('Commands');
    }
  );

  testWithFixture(
    'prints version when version flag is set.',
    [ 'empty-project' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter --version', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { stdout } = roboterResult.unwrapOrThrow();

      assert.that(stdout).is.containing(packageJson.version);
    }
  );
});
