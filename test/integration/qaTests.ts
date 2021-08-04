import { assert } from 'assertthat';
import { runCommand } from '../../lib/utils/runCommand';
import stripAnsi from 'strip-ansi';
import { stripIndent } from 'common-tags';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('qa', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'fails on failing test',
    [ 'test', 'with-failing-unit-test' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(
        'AssertionError [ERR_ASSERTION]: Expected true to be false.'
      );
      assert.that(stripAnsi(error.stderr)).is.containing('✗ Tests failed.');
    }
  );

  testWithFixture(
    'fails on incompatible license',
    [ 'license', 'with-incompatible-license-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containingAllOf([
        'Running license check',
        '  incompatible-package  0.0.0'
      ]);
      assert.that(stripAnsi(error.stderr)).is.containing('There are incompatible dependencies.');
    }
  );

  testWithFixture(
    'fails on eslint errors',
    [ 'analyze', 'with-eslint-errors' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(stripIndent`
          3:7  error  'x' is assigned a value but never used  no-unused-vars

        ✖ 1 problem (1 error, 0 warnings)
      `);
      assert.that(stripAnsi(error.stderr)).is.containing('Malformed code found.');
    }
  );

  testWithFixture(
    'warns on outdated dependency.',
    [ 'deps', 'with-outdated-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stripAnsi(stdout)).is.containing(stripIndent`
        Running outdated dependencies check...
          Package  Current  Wanted    Latest  Location            Depended by
        noop3     13.7.2  13.7.2
      `);
    }
  );

  testWithFixture(
    'warns on unused dependency.',
    [ 'deps', 'with-unused-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stripAnsi(stdout)).is.containing(stripIndent`
        The following dependencies are unused or missing:

        noop3
      `);
    }
  );

  testWithFixture(
    'succeeds if everything is fine',
    [ 'with-valid-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter qa', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );
});
