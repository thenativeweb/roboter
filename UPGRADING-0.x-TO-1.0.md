# Upgrading roboter from 0.x to 1.0

## System requirements

- roboter requires Node.js 8.0 or above.
- roboter works with macOS and Linux.
  - It has not been tested on Windows (it should basically work, but there is no guarantee).

## Installation

- Run `npm uninstall -g roboter-cli` to uninstall the globally installed `roboter-cli` package.
- Run `npm uninstall roboter-server` or `npm uninstall roboter-client` to uninstall the server- or client-side support packages from your module or application.
  - There is no distinction any more between using roboter for server-side and client-side code.
- Update `roboter` to `1.0.0` in your `package.json` file.
- Remove the `package-lock.json` file and the `node_modules` directory.
- Run `npm install`.

## Quick start

- Remove the `roboter.js` file from your module or application.
  - roboter tries to follow a zero-configuration approach.
  - Any configuration is done using default approaches, such as using `.babelrc`, `.eslintrc.json`, `mocha.opts`, …
- Replace custom tasks with npm scripts.
  - Custom tasks have been removed.
  - For complex things consider creating a Node.js script that is run by an npm script.

## The `analyse` task

- Adjust what should be analysed using an [`.eslintignore`](https://eslint.org/docs/user-guide/configuring#ignoring-files-and-directories) file.
- Use `analyse` to run the task.
  - The `analyze` alias has been removed.

## The `coverage` task

- Setup a custom solution for code coverage.
  - The `coverage` task has been removed.

## The `license` task

- License compatibility is now handled by roboter (but please note IANAL).
- To improve the license compatibility check [send a pull request](https://github.com/thenativeweb/roboter#the-license-task).
  - It is not possible any more to locally define license exceptions.

## The `outdated` task

- Run `npx roboter deps` instead.
  - The check for outdated dependencies is now part of the `deps` task.

## The `release` task

- Use `release` to run the task.
  - The `publish` alias has been removed.
- Use the `src` directory if you want to precompile your code.
  - This was previously provided using the `createDistribution` option.
- The distribution directory is hard-coded to `dist`.

## The `shell` task

- Replace shell tasks with npm scripts.
  - Shell tasks have been removed.
  - For complex things consider creating a Node.js script that is run by an npm script.

## The `test` task

- Replace the `test-units` task by `npx roboter test --type units`.
  - The same holds true for all other kinds of tests.
- Move all directories below `test` that don't contain tests, into a `test/shared` directory.
  - Otherwise they will be treated as test types and result in unexpected behavior.
- Rewrite your `pre.js` and `post.js` files using `async`/`await`.
- Custom file names for `pre.js` and `post.js` are not supported any more.

## The `unused-dependencies` task

- Run `npx roboter deps` instead.
  - The check for unused and missing dependencies is now part of the `deps` task.
- The `exclude` property has been removed.

## The `update` task

- The `update` task has been removed.
  - Consider using tools such as [npm-check-updates](https://www.npmjs.com/package/npm-check-updates) instead.

## The `build-client` task

- The `build-client` task has been removed.
  - Consider using solutions tailored specifically for your frontend stack instead.

## The `watch-client` task

- The `watch-client` task has been removed.
  - Consider using solutions tailored specifically for your frontend stack instead.

## The `build-server` task

- Run `npx roboter qa` instead.
  - The `build-server` task has been replaced by the `qa` task.

## The `watch-server` task

- Run `npx roboter test --watch` instead.
  - The `watch-server` task has been removed. The `test` task in watch mode is the closest equivalent.
