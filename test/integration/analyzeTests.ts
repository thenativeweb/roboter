import { assert } from 'assertthat';
import { runCommand } from '../../lib/utils/runCommand';
import stripAnsi from 'strip-ansi';
import { stripIndent } from 'common-tags';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';

suite('analyze', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'fails on invalid code.',
    [ 'analyze', 'with-eslint-errors' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
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
    'ignores nested node modules.',
    [ 'analyze', 'with-eslint-errors-in-nested-node-module' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'ignores node modules at top level.',
    [ 'analyze', 'with-eslint-errors-in-top-level-node-module' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'runs pre and post tasks.',
    [ 'analyze', 'with-preanalyze-and-postanalyze-task' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
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
    'succeeds on valid javascript code.',
    [ 'with-valid-javascript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'succeeds on valid typescript code.',
    [ 'with-valid-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'supports jsx.',
    [ 'analyze', 'with-valid-jsx' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(
        '7:5  error  Empty components are self-closing  react/self-closing-comp'
      );
    }
  );

  testWithFixture(
    'supports mocha tests.',
    [ 'analyze', 'with-eslint-errors-in-mocha-tests' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(
        '3:1  error  Unexpected pending mocha test  mocha/no-pending-tests'
      );
    }
  );

  testWithFixture(
    'supports nested eslint configurations.',
    [ 'analyze', 'with-nested-eslint-configuration' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'supports typescript.',
    [ 'analyze', 'with-eslint-errors-in-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(
        `5:7  error  'sum' is assigned a value but never used  @typescript-eslint/no-unused-vars`
      );
    }
  );

  testWithFixture(
    'uses eslintignore.',
    [ 'analyze', 'with-eslintignore' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    `uses the project's eslintrc.`,
    [ 'analyze', 'with-custom-eslintrc' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'fails on invalid package.json.',
    [ 'analyze', 'with-invalid-package.json' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(stripIndent`
        ./package.json
          error    name is required  (name)

        ✖ 1 problems (1 errors, 0 warnings)
      `);
      assert.that(stripAnsi(error.stderr)).is.containing('Malformed package.json found.');
    }
  );

  testWithFixture(
    'supports custom npmpackagejsonlintrc files.',
    [ 'analyze', 'with-invalid-package.json-and-custom-npmpackagejsonlintrc' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(stripIndent`
        ./package.json
          error    name is required  (name)

        ✖ 1 problems (1 errors, 0 warnings)
      `);
      assert.that(stripAnsi(error.stderr)).is.containing('Malformed package.json found.');
    }
  );

  testWithFixture(
    'fails with deprecated package license.',
    [ 'analyze', 'with-deprecated-license' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(stripIndent`
        GPL-2.0 is deprecated, please consider using an updated version of this license
      `);
      assert.that(stripAnsi(error.stderr)).is.containing('The given license is deprecated.');
    }
  );

  testWithFixture(
    'fails with unsupported package license.',
    [ 'analyze', 'with-unsupported-license' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containing(stripIndent`
        The given license is not supported, please check your spelling
      `);
      assert.that(stripAnsi(error.stderr)).is.containing('The given license is not a valid SPDX expression.');
    }
  );

  testWithFixture(
    'succeeds with deprecated package license and allowDeprecatedLicenseForThisPackage set to true.',
    [ 'analyze', 'with-deprecated-license-with-exception' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );

  testWithFixture(
    'succeeds with unsupported package license and allowUnsupportedLicenseForThisPackage set to true.',
    [ 'analyze', 'with-unsupported-license-with-exception' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter analyze', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      assert.that(roboterResult.unwrapOrThrow().exitCode).is.equalTo(0);
    }
  );
});
