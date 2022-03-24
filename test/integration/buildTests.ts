import { assert } from 'assertthat';
import fs from 'fs';
import path from 'path';
import { runCommand } from '../../lib/utils/runCommand';
import stripAnsi from 'strip-ansi';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('build', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'builds sources and tests using standard config.',
    [ 'with-valid-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);

      await assert.that(async (): Promise<void> => {
        await fs.promises.stat(path.join(fixture.absoluteTestDirectory, 'build', 'src', 'index.js'));
      }).is.not.throwingAsync();
      await assert.that(async (): Promise<void> => {
        await fs.promises.stat(path.join(fixture.absoluteTestDirectory, 'build', 'test', 'unit', 'someUnitTests.js'));
      }).is.not.throwingAsync();
      await assert.that(async (): Promise<void> => {
        await fs.promises.stat(path.join(fixture.absoluteTestDirectory, 'build', 'test', 'integration', 'someIntegrationTests.js'));
      }).is.not.throwingAsync();
    }
  );

  testWithFixture(
    'fails-when-build-fails.',
    [ 'build', 'with-invalid-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stderr)).is.containing('TypeScript compilation failed.');
    }
  );

  testWithFixture(
    'runs-pre-and-post-tasks.',
    [ 'build', 'with-prebuild-and-postbuild-task' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containing('From the pre task.');
      assert.that(stdout).is.containing('From the post task.');
    }
  );

  testWithFixture(
    'skips compilation without typescript.',
    [ 'with-valid-javascript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stderr } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stderr).is.containing('No TypeScript found, skipping build.');
    }
  );

  testWithFixture(
    'supports incremental flag.',
    [ 'build', 'with-tsconfig-incremental-flag-true' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();

      const builtFile = await fs.promises.readFile(
        path.join(fixture.absoluteTestDirectory, 'build', 'index.js'),
        { encoding: 'utf8' }
      );

      assert.that(builtFile).is.containing('function (left, right) {');
    }
  );

  testWithFixture(
    'respects the extends fields in tsconfig.json',
    [ 'build/with-extended-tsconfig' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter build', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );
});
