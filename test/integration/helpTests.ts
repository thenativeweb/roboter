import { assert } from 'assertthat';
import { runCommand } from '../../lib/utils/runCommand';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('help', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'prints usage.',
    [ 'empty-project' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter help', {
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
});
