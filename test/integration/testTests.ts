import { assert } from 'assertthat';
import fs from 'fs';
import path from 'path';
import { runCommand } from '../../lib/utils/runCommand';
import shell from 'shelljs';
import stripAnsi from 'strip-ansi';
import { testWithFixture } from '../shared/helpers/fixture/testWithFixture';
import { waitForStringInStream } from '../shared/helpers/waitForStringInStream';

suite('test', function (): void {
  this.timeout(3_600_000);

  testWithFixture(
    'fails on failing test and bails by default.',
    [ 'test', 'with-failing-unit-test' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containingAllOf([
        'Running unit tests...',
        'AssertionError [ERR_ASSERTION]: Expected true to be false.'
      ]);
      assert.that(stripAnsi(error.stdout)).is.not.containingAllOf([
        'Running integration tests...',
        'Tests successful.'
      ]);
      assert.that(stripAnsi(error.stderr)).is.containing('✗ Tests failed.');
    }
  );

  testWithFixture(
    'fails on failing test but runs all tests if --no-bail is given.',
    [ 'test', 'with-failing-unit-test' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test --no-bail', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      if (roboterResult.hasValue()) {
        throw new Error(`The command should have failed, but didn't.`);
      }

      const { error } = roboterResult;

      assert.that(error.exitCode).is.equalTo(1);
      assert.that(stripAnsi(error.stdout)).is.containingAllOf([
        'Running unit tests...',
        'AssertionError [ERR_ASSERTION]: Expected true to be false.',
        'Running integration tests...'
      ]);
      assert.that(stripAnsi(error.stdout)).is.not.containingAllOf([
        'Tests successful.'
      ]);
      assert.that(stripAnsi(error.stderr)).is.containing('✗ Tests failed.');
    }
  );

  testWithFixture(
    `ignores tests in the 'shared' directory.`,
    [ 'test', 'with-tests-in-shared' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containing('unit tests successful.');
    }
  );

  testWithFixture(
    'runs pre and post scripts and passes them the right parameters.',
    [ 'test', 'with-pre-and-post-scripts' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stripAnsi(stdout)).is.containingAllOf([
        'global pre script',
        'unit pre script',
        'Running unit tests...',
        'unit tests successful',
        'unit post script',
        'e2e pre script',
        'Running e2e tests...',
        'e2e tests successful',
        'e2e post script',
        'baz pre script',
        'Running baz tests...',
        'baz tests successful',
        'baz post script',
        'foobar pre script',
        'Running foobar tests...',
        'foobar tests successful',
        'foobar post script',
        'global post script'
      ]);
    }
  );

  testWithFixture(
    'runs all tests types.',
    [ 'with-valid-typescript' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stripAnsi(stdout)).is.containingAllOf([
        'Running unit tests...',
        'unit tests successful',
        'Running integration tests...',
        'integration tests successful',
        'Tests successful.'
      ]);
    }
  );

  testWithFixture(
    'runs pre and post tasks.',
    [ 'test', 'with-pretest-and-posttest-task' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
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
    'runs tsx tests.',
    [ 'test', 'with-tsx-tests' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containingAllOf([
        'Running unit tests...',
        'From the tsx test.',
        'unit tests successful.'
      ]);
    }
  );

  testWithFixture(
    'skips test execution if no test directory exists.',
    [ 'empty-project' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stderr } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stderr).is.containingAllOf([
        'No test directory found, skipping tests.'
      ]);
    }
  );

  testWithFixture(
    'loads .env files and applies their content to tests.',
    [ 'test', 'with-.env-file' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containingAllOf([
        'unit tests successful.',
        'integration tests successful.'
      ]);
    }
  );

  testWithFixture(
    'loads mocharc.js configuration files and applies them to tests.',
    [ 'test', 'with-mocharc-js-configuration-file' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containingAllOf([
        'unit tests successful.'
      ]);
    }
  );

  testWithFixture(
    'loads mocharc.json configuration files and applies them to tests.',
    [ 'test', 'with-mocharc-json-configuration-file' ],
    async (fixture): Promise<void> => {
      const roboterResult = await runCommand('npx roboter test', {
        cwd: fixture.absoluteTestDirectory,
        silent: true
      });

      assert.that(roboterResult).is.aValue();
      const { exitCode, stdout } = roboterResult.unwrapOrThrow();

      assert.that(exitCode).is.equalTo(0);
      assert.that(stdout).is.containingAllOf([
        'unit tests successful.'
      ]);
    }
  );

  testWithFixture(
    'supports watch mode',
    [ 'test', 'with-library-under-test' ],
    async (fixture): Promise<void> => {
      const childProcess = shell.exec(
        'npx roboter test',
        {
          cwd: fixture.absoluteTestDirectory,
          silent: true,
          async: true
        }
      );

      await waitForStringInStream({
        stream: childProcess.stdout!,
        string: 'unit tests successful',
        timeout: 5_000
      });

      await fs.promises.writeFile(
        path.join(fixture.absoluteTestDirectory, 'lib', 'lib.js'),
        'const number = 7;\n\nmodule.exports = number;',
        'utf-8'
      );

      await waitForStringInStream({
        stream: childProcess.stderr!,
        string: 'unit tests failed',
        timeout: 5_000
      });

      await new Promise((resolve): void => {
        childProcess.on('exit', resolve);
        childProcess.kill();
      });
    }
  );
});
