import { assert } from 'assertthat';
import { runCommand } from '../../lib/utils/runCommand';
import stripAnsi from 'strip-ansi';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('license', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'fails on incompatible license in dependency.',
    [ 'license', 'with-incompatible-license-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
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
    'fails on incompatible license in nested dependency.',
    [ 'license', 'with-incompatible-license-in-nested-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
    }
  );

  testWithFixture(
    'fails on unknown license in dependency.',
    [ 'license', 'with-unknown-license-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
    }
  );

  testWithFixture(
    'ignores .bin directory.',
    [ 'license', 'with-.bin-directory' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'ignores invalid package.json in dependency.',
    [ 'license', 'with-invalid-package-json-in-monorepo-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'supports semver ranges in knownPackageLicenses configuration.',
    [ 'license', 'with-semver-ranges-in-known-package-licenses-configuration' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    `respects knownPackageLicenses configuration and prefers it to a package's contained license.`,
    [ 'license', 'with-known-package-licenses-configuration' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'runs pre and post tasks.',
    [ 'license', 'with-prelicense-and-postlicense-task' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
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
    'skips license check without license check configuration.',
    [ 'empty-project' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stderr } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stderr).is.containing(
        'No list of compatible licenses found. Skipping license compatibility check...'
      );
    }
  );

  testWithFixture(
    'succeeds with compatible license in dependency.',
    [ 'license', 'with-compatible-license-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'supports license object.',
    [ 'license', 'with-license-object-in-dependency-package-json' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
    }
  );

  testWithFixture(
    'supports spdx expressions.',
    [ 'license', 'with-spdx-expression-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'uses the most permissible license, if multiple are given.',
    [ 'license', 'with-license-array-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'ignores packages that are not actual dependencies (not in node_modules or a vendor package).',
    [ 'license', 'with-irrelevant-package-json-in-dependency' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter license', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
    }
  );
});
