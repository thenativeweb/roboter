# roboter

roboter streamlines software development by automating tasks and enforcing conventions.

![roboter](https://github.com/thenativeweb/roboter/raw/master/images/logo.jpg "roboter")

## Status

| Category | Status |
|-|-|
| Version | [![npm](https://img.shields.io/npm/v/roboter)](https://www.npmjs.com/package/roboter) |
| Dependencies | ![David](https://img.shields.io/david/thenativeweb/roboter) |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/roboter) |
| Build | [![CircleCI](https://img.shields.io/circleci/build/github/thenativeweb/roboter)](https://circleci.com/gh/thenativeweb/roboter/tree/master) |
| License | ![GitHub](https://img.shields.io/github/license/thenativeweb/roboter) |

## Upgrading

### From 6.x to 7.x

roboter 7.x introduced support for TypeScript, but at the same time dropped support for Babel. However, TypeScript support is completely optional. If you want to use TypeScript, simply put a `tsconfig.json` file into the root of your package, and that's it (especially, you do not have to install TypeScript, since roboter includes TypeScript out of the box). The tests' pre and post tasks are now expected to be standalone executables instead of modules exporting `async` functions.

### From 5.x to 6.x

roboter 6.x received a major update with respect to the ESLint rules being used. That means that when you update you should be prepared to adjust some code analysis issues in your code. Additionally, you need to change the name of the ESLint configuration module in your `.eslintrc.json` file: The new base name is now `es/node` (was `es/2015/server`), if you are working on a client project it's `es/browser` (was `es/2015/client`).

### From 4.x to 5.x

roboter 5.x names the directory for unit tests `unit`, not `units`, to streamline things with `integration` and `performance`. This means that you need to rename the `units` directory to `unit` in your projects.

### From 3.x to 4.x

roboter 4.x slightly modifies the way it generates Table of Contents inside your `README.md` during the `publish` task. It is no longer necessary to add a `<!-- toc -->` tag your `README.md`. Instead add a heading called `Table of Contents` and roboter will insert a TOC below this headline. For more details refer to the section [Generating the TOC](#generating-the-toc)

### From 2.x to 3.x

roboter 3.x makes the `license` task fail if incompatible licenses were found. This means that you may need to adjust your build scripts, if you use the `license` task directly (you may have to ignore the exit code).

### From 1.x to 2.x

roboter 2.x introduces `babel` 7. If you have been using the precompilation feature of the `release` task, you might need to take action. If you've been using a local `.babelrc` make sure to upgrade it to the scoped package names of `babel` 7. If you have been using [`babel-runtime`](https://www.npmjs.com/package/babel-runtime) as a dependency in your module, also make sure to switch to the new scoped [`@babel/runtime`](https://www.npmjs.com/package/@babel/runtime) module.

Please refer to the [babel upgrading guide](https://babeljs.io/docs/en/next/v7-migration) and the new [`precompile`](#the-precompile-task) task that has been introduced to verify the precompilation result before a release.

## Installation

```shell
$ npm install roboter --save-dev
```

*Please note: Never install roboter globally, but always into the local context of your module or application.*

## Quick start

To run roboter, execute the following command:

```shell
$ npx roboter
```

Since you will run this command quite often, you may want to setup a shorter alias. To do so, add the following line to your profile file, such as `.profile` (or the respective file of your platform):

```shell
alias bot='npx roboter'
```

Then you can simply run `bot` instead of `npx roboter`. In the following we will assume that you have *not* setup an alias like this.

## Quick start

roboter provides a variety of tasks. To run them, run roboter and provide the task's name as parameter:

| Name | Description |
|-|-|
| [`analyse`](#the-analyse-task) | Runs code analysis. |
| [`deps`](#the-deps-task) | Checks for missing, outdated, and unused dependencies. |
| `help` | Shows the help. |
| [`license`](#the-license-task) | Checks dependencies for incompatible licenses. |
| [`precompile`](#the-precompile-task) | Precompiles source files using TypeScript. |
| [`qa`](#the-qa-task) | Runs code analysis, tests and checks dependencies. |
| [`release`](#the-release-task) | Releases a new version. |
| [`test`](#the-test-task) | Runs tests. |

If you don't specify a task, the `qa` task is run as default task.

To get help, run `npx roboter --help`. To get help for a specific command, run `npx roboter <command> --help`.

If you need more detailed output, provide the `--verbose` flag for any command.

### Running npm scripts

If your `package.json` file contains custom scripts, you can run them using roboter to have a streamlined user experience. Supposed, your `package.json` looks like this:

```json
{
  "scripts": {
    "analyse-css": "..."
  }
}
```

Then you can run the following command. If you specify any options, they will be handed over to the script:

```shell
$ npx roboter analyse-css
```

### Setting environment variables

Environment variables you specify when running roboter are also available to the tasks. E.g., if you want to run tests with disabled TLS verification, run roboter as follows:

```shell
$ NODE_TLS_REJECT_UNAUTHORIZED=0 npx roboter test
```

## The `analyse` task

This task runs code analysis on your code using [ESLint](http://eslint.org/). By default it uses the rules defined in the [eslint-config-es](https://www.npmjs.com/package/eslint-config-es) module.

### Flags

| Flag | Alias | Description |
|-|-|-|
| --watch | -w | Re-runs code analysis when files have been changed. |

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Code analysis failed |

### Details

Code analysis affects all `.js`, `.jsx`, `.ts` and `.tsx` files, but skips the following directories:

- `node_modules` (nested)
- `build` (only top-level)
- `coverage` (only top-level)
- `dist` (only top-level)

To exclude other files or directories, add an [`.eslintignore`](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file to the root directory of your module or application.

To adjust the ESLint rules to be used, add an [`.eslintrc.json`](https://eslint.org/docs/user-guide/configuring) file to the root directory of your module or application. You may [extend](http://eslint.org/docs/user-guide/configuring.html#extending-configuration-files) the built-in `es/node` configuration if you only need to change a few rules:

```json
{
  "extends": "es/node",
  "rules": {
    "eqeqeq": 0
  }
};
```

## The `deps` task

This task checks for missing, outdated, and unused dependencies.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |

*Please note that missing, outdated, or unused dependencies do not lead to an erroneous exit code. This is by design, since these situations are typically not critical, and you may want to ignore them intentionally.*

### Details

Under some circumstances, dependencies are reported as unused, although they are actually being used. This can be caused by dynamic requires, or similar things.

If you experience such a situation, feel free to ignore the warnings.

## The `license` task

This task checks your dependencies for incompatible licenses.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Incompatible licenses found |

### Details

roboter tries to get your dependencies' licenses from their respective `package.json` files and, if necessary, from a variety of [other places](https://github.com/thenativeweb/roboter/blob/master/lib/automation/pkg/getLicense.js), and tries to check the license compatibility based on a compatibility chart and a license list.

If you encounter a license incompatibility, and think that it should be fixed, please submit a pull request for either the [compatibility chart](https://github.com/thenativeweb/roboter/edit/master/configuration/licenseCompatibility.js) or the [license list](https://github.com/thenativeweb/roboter/edit/master/configuration/packageLicenses.js).

*Please note: Consider the license compatibility check of roboter only to be a suggestion, not as legal advice you can rely on. If you want to be on the safe side, consult a lawyer. the native web does not provide any warranty of any kind.*

To disable the license check, omit the `license` field in your `package.json` file, or set it to the value `UNKNOWN`.

## The `precompile` task

If you want to use TypeScript, add the required `tsconfig.json` file to the root of your package to enable precompilation.

*Please note that you do not need to install TypeScript itself, as this is provided by roboter out of the box.*

Any precompilation options are configured using the aforementioned `tsconfig.json` file.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Precompilation failed |

*Please note that missing, outdated, or unused dependencies do not lead to an erroneous exit code. This is by design, since these situations are typically not critical, and you may want to ignore them intentionally.*

### Details

None

## The `qa` task

This task runs the tasks [analyse](#the-analyse-task), [test](#the-test-task), and [deps](#the-deps-task) sequentially.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Code analysis or tests failed |

*Please note that missing, outdated, or unused dependencies do not lead to an erroneous exit code. This is by design, since these situations are typically not critical, and you may want to ignore them intentionally.*

### Details

None

## The `release` task

This task releases a new version.

It first runs the tasks [analyse](#the-analyse-task), [test](#the-test-task), and [deps](#the-deps-task) sequentially.

Afterwards, it runs the following tasks:

- Check if you're currently in the `master` branch
- Check if there are any pending, i.e. not yet committed, changes
- Check if your local `master` branch is up-to-date with the remote one
- Optional: [Generate the TOC](#generating-the-toc) in the `README.md` file
- Optional: [Precompile code](#precompiling-the-code-before-releasing) using TypeScript
- Increase version number
- Commit all changes
- Create a tag for the new version
- Push all changes and the tag

*Please note: This task does not publish your module or application to the npm registry. Instead, you need to do this manually by running `npm publish`.*

### Flags

| Flag | Alias | Description |
|-|-|-|
| --force | -f | Releases without running tests, code analysis etc. |
| --type | -t | Specifies the type of the release, either `patch`, `minor`, or `major`. |

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Code analysis or tests failed |

### Details

For generating version numbers roboter uses [SemVer](https://semver.org/). It omits the leading `v`.

#### Generating the TOC

To automatically generate a TOC for your `README.md` file add the following line to your `README.md`.

```markdown
## Table of Contents
```

*Please note: roboter looks for the first heading containing 'Table of Contents', 'toc', or 'table-of-contents'. It removes all following contents until an equal or higher heading is found and inserts a table of contents.*

#### Precompiling the code before releasing

You can use roboter to automatically precompile your code before publishing. roboter will run the [`precompile`](#the-precompile-task) task automatically for you. For details on how to enable and to configure this precompilation step, see the [`precompile`](#the-precompile-task) task.

## The `test` task

This task runs unit, integration, and other tests using [Mocha](https://mochajs.org/).

### Flags

| Flag | Alias | Description |
|-|-|-|
| --type | -t | The test type, such as `units`, `integration`, … |
| --watch | -w | Re-runs tests when files have been changed. |

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Tests failed |

### Details

roboter will look for test types in the `test` directory of your module or application. You can add a type by simply creating a directory with the desired name, e.g. `unit`, `integration`, `performance`, …

If you are running the tests in watch  mode, tests are triggered by any change on `.js`, `.jsx`, `.ts` and `.tsx` files, without taking the following directories into account:

- `node_modules` (nested)
- `build` (only top-level)
- `coverage` (only top-level)
- `dist` (only top-level)

#### Creating tests

To create tests, add files with the naming schema `*Tests.js` (or `*Tests.ts`, if you use TypeScript) to your test type directories. Use Mocha's [`tdd` interface](https://mochajs.org/#tdd) when writing tests. Please also note that all your tests must be asynchronous, i.e. they must either use the `done` callback or use the `async` keyword:

```javascript
// test/integration/databaseTests.js

suite('connect', () => {
  test('connects to the database.', async () => {
    // ...
  });
});
```

The test types are run in a specific order. If present, roboter will first run `unit`, `integration`, `e2e`, and `performance`. After those test types, all remaining ones will be run in alphabetical order.

#### Using shared test helpers

If you want to use functions shared across multiple tests or test types, create a directory `test/shared` and put your code into it. This directory is handled as a special case and will not be picked up as a test type.

#### Setting up and tearing down test types

If you need to register any additional pre or post actions (such as starting or stopping Docker containers, …) that shall be run before or after all tests of a given type, add a `pre.js` respectively a `post.js` file (or `pre.ts` and `post.ts`, if you use TypeScript), that act as standalone modules. If you want to use `async` and `await`, you have to wrap the file's content in an asynchronous IIFE:

```javascript
'use strict';

(async () => {
  // ...  
})();
```

*Please note: The `post.js` respectively `post.ts` file will be run no matter whether the tests themselves were run successfully or not.*

#### Configuring test execution

To adjust test execution, you can provide a [`mocha.opts`](https://mochajs.org/#mochaopts) file per test type. However, the following options can not be overwritten, and are always set:

- `--async-only`
- `--bail`
- `--colors`
- `--exit`
- `--ui tdd`

## Running the tests

To run the tests run the following command:

```shell
$ npm run test
```

You can run all integration tests for one task by specifying the task name as an additional argument:

```shell
$ npm run test release
```

You can run a single integration test case by specifying the individual test as an additional argument:

```shell
$ npm run test release/bumps-minor-version
```

## Running the build

Unfortunately, this module can not be used to build itself. Hence you have to use `npm` for that.

To analyse the source code run the following command:

```shell
$ npm run analyse
```

To release a new version run the following command:

```shell
$ npm run publish-patch
```

Alternatively you may also use `publish-minor` and `publish-major`, depending on the changes you have made.
