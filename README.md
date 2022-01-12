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
| [`analyze`](#the-analyze-task) | Runs code analysis. |
| [`build`](#the-build-task) | Builds a project using TypeScript. |
| [`deps`](#the-deps-task) | Checks for missing, outdated, and unused dependencies. |
| `help` | Shows the help. |
| [`license`](#the-license-task) | Checks dependencies for incompatible licenses. |
| [`qa`](#the-qa-task) | Runs code analysis, tests and checks dependencies. |
| [`test`](#the-test-task) | Runs tests. |

If you don't specify a task, the `qa` task is run as default task.

To get help, run `npx roboter --help`. To get help for a specific command, run `npx roboter <command> --help`.

## The `analyze` task

This task runs code analysis on your code using [ESLint](http://eslint.org/) and [npm-package-json-lint](https://npmpackagejsonlint.org/). By default it uses the rules defined in the [eslint-config-es](https://www.npmjs.com/package/eslint-config-es) module and the [npm-package-json-lint-config-tnw](https://www.npmjs.com/package/npm-package-json-lint-config-tnw) module.

### Flags

None

### Exit codes

| Exit code | Description |
|-|-|
| 0 | Success |
| 1 | Code analysis failed |

### Details

The ESLint code analysis affects all `.js`, `.jsx`, `.ts` and `.tsx` files, but skips the following directories:

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
}
```

The npm-package-json-lint analysis only affects the `package.json` file in the root of your project. It is currently not possible to analyze package files in other locations.

To adjust the rules to be used, add an [`.npmpackagejsonlintrc.json`](https://npmpackagejsonlint.org/docs/en/rcfile-example) file to the root directory of your module or application. You may [extend](https://npmpackagejsonlint.org/docs/en/configuration#how-to-use-a-shared-config-module) the `npm-package-json-lint-config-tnw/app.json` configuration, the `npm-package-json-lint-config-tnw/lib.json` configuration or any configuration you have made yourself.

In addition to the linting provided by [npm-package-json-lint](https://npmpackagejsonlint.org/), roboter checks the license provided
by you against the [SPDX license list](https://github.com/spdx/license-list-XML). The default behavior is to reject licenses that are not present on the list, as well as deprecated licenses. If you wish to use a more exotic license that is not listed by SPDX, you may set `allowUnsupportedLicenseForThisPackage` to `true` in `licenseCheck.json`. Deprecated licenses can be enabled in a similar way by setting `allowDeprecatedLicenseForThisPackage` to `true` in `licenseCheck.json`.

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

roboter tries to get your dependencies' licenses from their respective `package.json` files and, if necessary, from a variety of [other places](https://github.com/thenativeweb/roboter/blob/main/lib/steps/license/getLicense.ts), and tries to check the license compatibility based on a compatibility chart and a license list.

Since license compatibility is a difficult issue and depends very much on the situation, your willingness to take risks and your lawyers interpretation of license law, you need to configure which licenses you deem compatible to your project yourself. To do so, create a `licenseCheck.json` file in the root of your project with this general layout:

```json
{
  "compatibleLicenses": [
    "MIT",
    "Apache-2.0",
    ...
  ]
}
```

The list of compatible licenses most contain only valid [SPDX-expressions](https://spdx.org/licenses/).

If one of your dependencies does not specify its license in a valid format and the roboter can not read it, or if you have a license agreement with someone that is not reflected in their package manifest, you can override any package's license in your `licenseCheck.json` file:

```json
{
  "compatibleLicenses": [ ... ],
  "knownPackageLicenses": {
    "<package-name>": {
      "<package-version-semver>": "<license SPDX-expression>"
    }
  }
}
```

*Please note: Consider the license compatibility check of roboter only to be a suggestion, not as legal advice you can rely on. If you want to be on the safe side, consult a lawyer. the native web does not provide any warranty of any kind.*

To disable the license check, omit the `licenseCheck.json` file in your application root.

## The `qa` task

This task runs the tasks [analyze](#the-analyze-task), [test](#the-test-task), [deps](#the-deps-task), and [license](#the-license-task) sequentially.

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
| --no-bail | -b | Runs all tests, withouth bailing after failing tests. |
| --watch | -w | Starts the tests in watch mode and reruns tests on file changes. |
| --grep | -g | Filters tests to run according to a given regexp. |

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

If you need to register any additional pre or post actions (such as starting or stopping Docker containers, …) that shall be run before or after all tests of a given type, create a `pre.js` and/or a `post.js` file (or `pre.ts` and `post.ts`, if you use TypeScript) in the according test type folder. If you want to run some actions before or after all test types, create a `pre.js` / `post.js` / `pre.ts` / `post.ts` in the `test` folder.

Each of these files needs to default export a function that matches one of the `...Script` types the roboter exports. The function exported from a `pre.ts` file must match the type `TestPreScript` and take the `TestPreScriptParameters` and vice versa.

```typescript
import { TestPreScript, TestPreScriptParameters } from 'roboter';

const script: TestPreScript = async function (parameters: TestPreScriptParameters): Promise<void> {
  // ...
}

export default script;
```

*Please note: The `post.js` respectively `post.ts` file will be run no matter whether the tests themselves were run successfully or not.*

Exemplary, for a project with the test types `unit`, `integration` and `e2e`, the scripts are run in this order:

- global pre script
    - unit pre script
        - unit tests
    - unit post script
    - integration pre script
        - integration tests
    - integration post script
    - e2e pre script
        - e2e tests
    - e2e post script
- global post script

All these scripts receive some parameter as seen in the TypeScript types. These parameters are especially relevant for the watch mode:

When running the tests in watch mode, the scripts are run for every test iteration. I.e. if you change a file and tests need to be re-run, all relevant scripts are executed. Their parameters change with every execution, since they receive a running count of the amount of test iterations since watch mode was started. This way you can write your scripts so that they only execute your setup / teardown logic when you really need them to.

#### Returning values from pre-scripts and accessing them

The global preTscript as well as the individual pre-scripts may return arbitrary objects (not primitive values!) as can be seen in the `TestPreScript` type signature.

The returned objects from the global pre-script and the individual pre-scripts are available to the corresponding post-scripts via the `preScriptData` property. This is useful if, for example, you want to start a docker container before running your tests and to avoid collision include a random string in its name. This random string is then necessary in the post-script to cleanly stop and remove the container.

It is also possible to access the values returned by the pre-scripts inside the tests. To make these values available, they are attached to the mocha context of every suite. You can access them like this:

```typescript
suite('some test suite', function (): void {
    const { someValue } = this.ctx.roboter;
});
```

The `this.ctx.roboter` property is an object that contains the merged return values from the global pre-script and the pre-script of the test type to which the suite belongs. The returned object from the test type has precedence in the merge.

#### Setting environment variables

To set environment variables that are available in the tests, you can create a `.env` file per test type:

```shell
SOME_ENV=foo
```

#### Configuring test execution

To adjust test execution, you can provide a [`.mocharc.json` or `.mocharc.js`](https://mochajs.org/#configuring-mocha-nodejs) file per test type. However, the following options can not be overwritten, and are always set:

- `--async-only`
- `--bail`
- `--colors`
- `--exit`
- `--ui tdd`

## Running quality assurance

Since this is roboter itself, we can't just run `npx roboter`. But we still want to use roboter to quality test itself. So we run:

```shell
$ npm run roboter
```

You can use all the sub-commands and flags roboter supports.
