# roboter

roboter streamlines software development by automating tasks and enforcing conventions.

![roboter](https://github.com/thenativeweb/roboter/raw/master/images/logo.jpg "roboter")

## Upgrading from 5.x to 6.x

roboter 6.x received a major update with respect to the ESLint rules being used. That means that when you update you should be prepared to adjust some code analysis issues in your code. Additionally, you need to change the name of the ESLint configuration module in your `.eslintrc.json` file: The new base name is now `es/node` (was `es/2015/server`), if you are working on a client project it's `es/browser` (was `es/2015/client`).

## Upgrading from 4.x to 5.x

roboter 5.x names the directory for unit tests `unit`, not `units`, to streamline things with `integration` and `performance`. This means that you need to rename the `units` directory to `unit` in your projects.

## Upgrading from 3.x to 4.x

roboter 4.x slightly modifies the way it generates Table of Contents inside your `README.md` during the `publish` task. It is no longer necessary to add a `<!-- toc -->` tag your `README.md`. Instead add a heading called `Table of Contents` and roboter will insert a TOC below this headline. For more details refer to the section [Generating the TOC](#generating-the-toc)

## Upgrading from 2.x to 3.x

roboter 3.x makes the `license` task fail if incompatible licenses were found. This means that you may need to adjust your build scripts, if you use the `license` task directly (you may have to ignore the exit code).

## Upgrading from 1.x to 2.x

roboter 2.x introduces `babel` 7. To upgrade, please refer to the [upgrading guide](UPGRADING-1.x-TO-2.0.md).

## Upgrading from 0.x to 1.x

roboter 1.x was rewritten from scratch, and introduces a variety of breaking changes compared to the 0.x series. To upgrade, please refer to the [upgrading guide](UPGRADING-0.x-TO-1.0.md).

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
| [`precompile`](#the-precompile-task) | Precompiles source files using babel. |
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

Code analysis affects all `.js` and `.jsx` files, but skips the following directories:

- `node_modules` (nested)
- `build` (only top-level)
- `coverage` (only top-level)
- `dist` (only top-level)

To exclude other files or directories, add an [`.eslintignore`](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file to the root directory of your module or application.

To adjust the ESLint rules to be used, add an [`.eslintrc.json`](https://eslint.org/docs/user-guide/configuring) file to the root directory of your module or application. You may [extend](http://eslint.org/docs/user-guide/configuring.html#extending-configuration-files) the built-in `es/2015/server` configuration if you only need to change a few rules:

```json
{
  "extends": "es/2015/server",
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

If you want to create a module or application that also runs in environments that only support ES5, put all your code into a `src` directory below the root of your module or application. The precompiled code will be put into the `dist` directory. Additionally the [`release`](#the-release-task) task will precompile automatically for you when creating a new release. So this `precompile` task is mainly intended to be used as a helper to verify your precompiled output before releasing a new version.

Make sure to reference the files in the `dist` directory when specifying the `main` and the `bin` fields in your `package.json` file.

*Please note: The precompilation step does only transform your code, not bundle it.*

All `.js` and `.jsx` files inside of the `src` directory will be precompiled using Babel with the [`@babel/env` ](https://babeljs.io/docs/en/babel-preset-env) and [`@babel/react` ](https://babeljs.io/docs/en/babel-preset-react) presets. To customize the presets and plugins being used, add a [`.babelrc or a babel.config.js file`](https://babeljs.io/docs/en/configuration) to the root directory of your module or application.

By default roboter uses the [`babel-plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime). So instead of inlining runtime functions into every file that needs them, babel will rather require them from the [`@babel/runtime`](https://www.npmjs.com/package/@babel/runtime) module. This reduces the size of the generated code as babel won't include the same runtime functions over and over again.

If you are using features like `async/await` that will require the babel runtime, you need to make need to make sure to also include [`@babel/runtime`](https://www.npmjs.com/package/@babel/runtime) as a dependency into your project. You can use this task before releasing to verify if the compiled version of your module actually requires `@babel/runtime`.

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
- Optional: [Precompile code](#precompiling-the-code-before-releasing) using Babel
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

roboter will look for test types in the `test` directory of your module or application. You can add a type by simply creating a directory with the desired name, e.g. `units`, `integration`, `performance`, …

If you are running the tests in watch  mode, tests are triggered by any change on `.js` files, without taking the following directories into account:

- `node_modules` (nested)
- `build` (only top-level)
- `coverage` (only top-level)
- `dist` (only top-level)

#### Creating tests

To create tests, add files with the naming schema `*Tests.js` to your test type directories. Use Mocha's [`tdd` interface](https://mochajs.org/#tdd) when writing tests. Please also note that all your tests must be asynchronous, i.e. they must either use the `done` callback or use the `async` keyword:

```javascript
// test/integration/databaseTests.js

suite('connect', () => {
  test('connects to the database.', async () => {
    // ...
  });
});
```

The test types are run in a specific order. If present, roboter will first run `units`, `integration`, `e2e`, and `performance`. After those test types, all remaining ones will be run in alphabetical order.

#### Using shared test helpers

If you want to use functions shared across multiple tests or test types, create a directory `test/shared` and put your code into it. This directory is handled as a special case and will not be picked up as a test type.

#### Setting up and tearing down test types

If you need to register any additional pre or post actions (such as starting or stopping Docker containers, …) that shall be run before or after all tests of a given type, add a `pre.js` respectively a `post.js` file, that export an asynchronous function:

```javascript
'use strict';

module.exports = async function () {
  // ...
};
```

*Please note: The `post.js` file will be run no matter whether the tests themselves were run successfully or not.*

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

## License

The MIT License (MIT)
Copyright (c) 2015-2019 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
