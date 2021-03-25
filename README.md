# roboter

roboter streamlines software development by automating tasks and enforcing conventions.

![roboter](https://github.com/thenativeweb/roboter/raw/main/images/logo.jpg "roboter")

## Status

| Category | Status |
|-|-|
| Version | [![npm](https://img.shields.io/npm/v/roboter)](https://www.npmjs.com/package/roboter) |
| Dependencies | ![David](https://img.shields.io/david/thenativeweb/roboter) |
| Dev dependencies | ![David](https://img.shields.io/david/dev/thenativeweb/roboter) |
| Build | ![GitHub Actions](https://github.com/thenativeweb/roboter/workflows/Release/badge.svg?branch=main) |
| License | ![GitHub](https://img.shields.io/github/license/thenativeweb/roboter) |

## Installation

```shell
$ npm install roboter
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
| [`build`](#the-build-task) | Builds a project using TypeScript. |
| [`deps`](#the-deps-task) | Checks for missing, outdated, and unused dependencies. |
| `help` | Shows the help. |
| [`license`](#the-license-task) | Checks dependencies for incompatible licenses. |
| [`qa`](#the-qa-task) | Runs code analysis, tests and checks dependencies. |
| [`test`](#the-test-task) | Runs tests. |
| [`update`](#the-update-task) | Updates the Node.js version. |

If you don't specify a task, the `qa` task is run as default task.

To get help, run `npx roboter --help`. To get help for a specific command, run `npx roboter <command> --help`.

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

In addition to this, for any command you can run you can add a `pre...` and / or `post...` script to the `scripts` section of your application's `package.json` file, which then gets executed when the appropriate task is run.

### Setting environment variables

Environment variables you specify when running roboter are also available to the tasks. E.g., if you want to run tests with disabled TLS verification, run roboter as follows:

```shell
$ NODE_TLS_REJECT_UNAUTHORIZED=0 npx roboter test
```

## The `analyse` task

This task runs code analysis on your code using [ESLint](http://eslint.org/). By default it uses the rules defined in the [eslint-config-es](https://www.npmjs.com/package/eslint-config-es) module.

### Flags

None

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

## The `build` task

If you want to use TypeScript, add the required `tsconfig.json` file to the root of your package to enable compilation on build.

*Please note that you do not need to install TypeScript itself, as this is provided by roboter out of the box.*

Any build options are configured using the aforementioned `tsconfig.json` file.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Build failed |

*Please note that missing, outdated, or unused dependencies do not lead to an erroneous exit code. This is by design, since these situations are typically not critical, and you may want to ignore them intentionally.*

### Details

None

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

roboter tries to get your dependencies' licenses from their respective `package.json` files and, if necessary, from a variety of [other places](https://github.com/thenativeweb/roboter/blob/main/lib/steps/license/getLicense.js), and tries to check the license compatibility based on a compatibility chart and a license list.

If you encounter a license incompatibility, and think that it should be fixed, please submit a pull request for either the [compatibility chart](https://github.com/thenativeweb/roboter/edit/main/configuration/licenseCompatibility.js) or the [license list](https://github.com/thenativeweb/roboter/edit/main/configuration/packageLicenses.js).

*Please note: Consider the license compatibility check of roboter only to be a suggestion, not as legal advice you can rely on. If you want to be on the safe side, consult a lawyer. the native web does not provide any warranty of any kind.*

To disable the license check, omit the `license` field in your `package.json` file, or set it to the value `UNKNOWN`.

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

## The `test` task

This task runs unit, integration, and other tests using [Mocha](https://mochajs.org/).

### Flags

| Flag | Alias | Description |
|-|-|-|
| --type | -t | The test type, such as `unit`, `integration`, … |

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Tests failed |

### Details

roboter will look for test types in the `test` directory of your module or application. You can add a type by simply creating a directory with the desired name, e.g. `unit`, `integration`, `performance`, …

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

#### Setting up and tearing down tests globally

If you need to set something up and tear something down across all of your test types, add a `pre.js` and `post.js` (or `pre.ts` and `post.ts`) in the `test` folder of your project. These work just like the test specific pre/post tasks above but are only run once before and after all tests.

#### Setting environment variables

To set environment variables that are available in the tests, you can create a `.env` file per test type:

```shell
SOME_ENV=foo
```

#### Configuring test execution

To adjust test execution, you can provide a [`.mocharc.json`](https://mochajs.org/#configuring-mocha-nodejs) file per test type. However, the following options can not be overwritten, and are always set:

- `--async-only`
- `--bail`
- `--colors`
- `--exit`
- `--ui tdd`

### The `update` task

This task updates the Node.js version to the latest available LTS version as long as it is newer than the currently used version, commits it and optionally pushes the changes.

I.e. if you're on version `8.2.0`, it will update to the latest LTS (at the time of writing `10.16.3`). But if you're on `12.11.0` (the most current version at the time of writing), it won't change anything.

### Flags

| Flag | Alias | Description |
|-|-|-|
| --no-push | -p | Prevents pushing the changes. |
| --node | -n | Whether Node.js should be updated. True by default, currently has no effect. |

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success (either updates were made or were not necessary) |
| 1 | Update failed |

## Running the tests

To run the tests run the following command:

```shell
$ npm run test
```

You can run all integration tests for one task by specifying the task name as an additional argument:

```shell
$ npm run test analyse
```

You can run a single integration test case by specifying the individual test as an additional argument:

```shell
$ npm run test analyse/fails-on-invalid-code
```

## Running the build

Unfortunately, this module can not be used to build itself. Hence you have to use `npm` for that.

To analyse the source code run the following command:

```shell
$ npm run analyse
```
