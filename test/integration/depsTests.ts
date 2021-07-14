import { assert } from 'assertthat';
import { runCommand } from '../../lib/utils/runCommand';
import stripAnsi from 'strip-ansi';
import { stripIndent } from 'common-tags';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('deps', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'does not warn if everything is fine.',
    [ 'deps', 'with-up-to-date-dependencies' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();
      const stdoutWithoutColor = stripAnsi(stdout);

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdoutWithoutColor).is.containing('▸ Running unused or missing dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running strict dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running outdated dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('Dependency check successful.');
    }
  );

  testWithFixture(
    'does not warn if everything is fine, even with tsx.',
    [ 'deps', 'with-up-to-date-dependencies-in-tsx' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();
      const stdoutWithoutColor = stripAnsi(stdout);

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdoutWithoutColor).is.containing('▸ Running unused or missing dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running strict dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running outdated dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('Dependency check successful.');
    }
  );

  testWithFixture(
    'does not warn if everything is fine, even with typescript.',
    [ 'deps', 'with-up-to-date-dependencies-in-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();
      const stdoutWithoutColor = stripAnsi(stdout);

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdoutWithoutColor).is.containing('▸ Running unused or missing dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running strict dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('▸ Running outdated dependencies check...\n─');
      assert.that(stdoutWithoutColor).is.containing('Dependency check successful.');
    }
  );

  testWithFixture(
    'fails on non-strict dependency.',
    [ 'deps', 'with-non-strict-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containingAllOf([
        'Running strict dependencies check...',
        'Name   Version  Type',
        '─────  ───────  ────────────',
        'noop3  ^13.7.2  dependencies'
      ]);
      assert.that(stripAnsi(error.stderr)).is.containing(
        'Non-strict dependencies found.'
      );

      // Regression test, see #464.
      assert.that(stripAnsi(error.stdout)).is.not.containing(
        'TypeError: errors.NonStrictDependenciesFound is not a constructor'
      );
    }
  );

  testWithFixture(
    'fails on non-strict dev-dependency.',
    [ 'deps', 'with-non-strict-dev-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containingAllOf([
        'Running strict dependencies check...',
        'Name   Version  Type',
        '─────  ───────  ────────────',
        'noop3  ^13.7.2  devDependencies'
      ]);
      assert.that(stripAnsi(error.stderr)).is.containing(
        'Non-strict dependencies found.'
      );

      // Regression test, see #464.
      assert.that(stripAnsi(error.stdout)).is.not.containing(
        'TypeError: errors.NonStrictDependenciesFound is not a constructor'
      );
    }
  );

  testWithFixture(
    'runs pre and post tasks.',
    [ 'deps', 'with-predeps-and-postdeps-task' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
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
    'warns on outdated dependency.',
    [ 'deps', 'with-outdated-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
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
      const roboterResult = await runCommand('npx roboter deps', {
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
    'warns on unused dependency, even with tsx.',
    [ 'deps', 'with-unused-dependency-in-tsx' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter deps', {
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
});
