# roboter

roboter automates your build.

![roboter](https://github.com/thenativeweb/roboter/raw/master/images/logo.jpg "roboter")

## Installation

```bash
$ npm install roboter
```

Additionally, you either need to install [roboter-server](https://www.npmjs.com/package/roboter-server) or [roboter-client](https://www.npmjs.com/package/roboter-client), depending on whether you want to do development for the server- or the client-side.

```bash
$ npm install roboter-server
$ npm install roboter-client
```

To use roboter it is recommended to install [roboter-cli](https://www.npmjs.com/package/roboter-cli) globally. This way you can easily run roboter by simply typing `bot`. To install roboter-cli, run the following command.

```bash
$ npm install -g roboter-cli
```

## Quick start

First you need to create a `roboter.js` file in your application's directory. Inside that file you need to reference the module, define the environment you are working in, and run `start`.

```javascript
'use strict';

const roboter = require('roboter');

roboter.
  workOn('server').
  start();
```

This already allows you to run some pre-defined tasks, e.g. code-analysis. For that run the `bot` CLI tool and provide `analyze` as parameter.

```bash
$ bot analyze
```

By default, the pre-defined tasks use a default configuration. Most probably you want to change it. To do so, use the `equipWith` function and setup the desired tasks. Please note that the actual configuration is of course task-dependent.

```javascript
'use strict';

const roboter = require('roboter');

roboter.
  workOn('server').
  equipWith(task => {
    task('universal/analyze', {
      src: [ '**/*.js', '!node_modules/**/*.js' ]
    });
  }).
  start();
```

If you want to register custom tasks use the `custom/` prefix and provide an asynchronous function with a `done` callback.

```javascript
roboter.
  workOn('server').
  equipWith(task => {
    task('custom/foo', done => {
      // ...
    });
  }).
  start();
```

Then you can run your custom code using `bot foo`. To avoid naming conflicts with built-in tasks, it is recommended to prefix your task names with a unique identifier such as `custom-`. Of course, then you need to run `bot custom-foo` on the command-line.

```javascript
roboter.
  workOn('server').
  equipWith(task => {
    task('custom/custom-foo', done => {
      // ...
    });
  }).
  start();
```

If you want to get an overview of all available tasks, simply run `bot` with the `--help` parameter.

```bash
$ bot --help
```

Any environment variables you specify when running `bot` are also available for the tasks. E.g., if you want to run unit tests with disabled TLS verification, run bot as follows.

```bash
$ NODE_TLS_REJECT_UNAUTHORIZED=0 bot test-units
```

## Configuring and using tasks

Before using tasks you need to select an environment, i.e. whether you are working on a `client` or a `server` project. For that provide the name of the environment to the `workOn` function.

The environment you select defines what tasks are available to you. The exception to the rule are the *universal* tasks that are available independent of the selected environment.

### Universal tasks

- [`analyze`](#the-analyze-task)
- [`coverage`](#the-coverage-task)
- [`generate-toc`](#the-generate-toc-task)
- [`license`](#the-license-task)
- [`outdated`](#the-outdated-task)
- [`release`](#the-release-task)
- [`shell`](#the-shell-task)
- [`test`](#the-test-task)
- [`test-integration`](#the-test-integration-task)
- [`test-units`](#the-test-units-task)
- [`unused-dependencies`](#the-unused-dependencies-task)
- [`update`](#the-update-task)

### Client tasks

- [`build-client`](#the-build-client-task)
- [`watch-client`](#the-watch-client-task)

### Server tasks

- [`build-server`](#the-build-server-task)
- [`watch-server`](#the-watch-server-task)

## Universal tasks

### The `analyze` task

This task runs static code analysis on your source files. You only need to specify which files to analyse. For that use the `src` parameter.

```javascript
task('universal/analyze', {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
});
```

By default, the `analyze` task uses a built-in rule set, but you may override it by specifying the path to an [ESLint](http://eslint.org/) configuration file or to a [shareable ESLint configuration](http://eslint.org/docs/developer-guide/shareable-configs.html). Either way, use the `rules` property for overriding the default.

```javascript
task('universal/analyze', {
  src: [ '**/*.js', '!node_modules/**/*.js' ],
  rules: '.eslintrc'
});
```

To use a shareable ESLint configuration first install the desired npm module.

```bash
$ npm install <eslint-config-myconfig>
```

Next remove the `eslint-config-` prefix from the module name and provide what's left as value to the `rules` property.

```javascript
task('universal/analyze', {
  src: [ '**/*.js', '!node_modules/**/*.js' ],
  rules: 'myconfig'
});
```

Whether you use a configuration file or a shareable configuration, you can always make use of ESLint's [extends](http://eslint.org/docs/user-guide/configuring.html#extending-configuration-files) feature which allows to build a hierarchy of ESLint configurations.

As an example, the following shareable configuration uses the `2015/server.js` file from the `eslint-config-es` module as its base and overrides two rules while keeping the others.

```javascript
module.exports = {
  extends: 'es/2015/server',
  rules: {
    'array-bracket-spacing': [ 2, 'never' ],
    'object-curly-spacing': [ 2, 'always' ]
  }
};
```

To run this task use the following command.

```bash
$ bot analyze
```

To run this task continuously run the following command.

```bash
$ bot watch-analyze
```

### The `coverage` task

This task calculates the coverage of your [unit tests](#the-test-units-task) and creates an HTML report in the project's `coverage` directory.

```javascript
task('universal/coverage', {
  src: [ './lib/**/*.js', './src/**/*.js' ],
  test: './test/units/**/*Tests.js'
});
```

By default, roboter assumes that the code to calculate the coverage for is located in the `lib` or the `src` directory, and that your unit tests are located in the `test/units` directory of your project. If you need to, specify other directories using the `src` and `test` parameters.

Optionally, you may specify a coverage threshold which fails the build if it is not being reached. The value must be given as percentage, i.e. as a number between `0` and `100`:

```javascript
task('universal/coverage', {
  threshold: 90
});
```

For more details, please refer to the [documentation of istanbul](https://github.com/peterjwest/istanbul-threshold-checker#thresholds).

By default, code files that are not tested by any test are ignored. To take these files into account as well, set the `includeUntested` parameter to `true`:

```javascript
task('universal/coverage', {
  includeUntested: true
});
```

To run this task use the following command.

```bash
$ bot coverage
```

### The `generate-toc` task

This task generates a TOC for your `README.md` file. To enable this task, add the following line to your `README.md` file.

```html
<!-- toc -->
```

### The `license` task

This task checks whether the licenses of your dependencies are compatible to your license. It assumes that the license you use yourself is fine to use for your dependencies, too.

To accept additional licenses, add them to the `compatible` property of the task configuration.

```javascript
task('universal/license', {
  compatible: [ 'MIT', 'ISC' ]
});
```

To run this task use the following command.

```bash
$ bot license
```

### The `outdated` task

This task verifies whether all of your dependencies and development dependencies are up-to-date.

To run this task use the following command.

```bash
$ bot outdated
```

### The `release` task

This task publishes your project. Before publishing it, the task also runs the code analysis and the tests, and checks whether your Git repositoriy is up-to-date. Additionally, it updates the TOC of your `README.md` file, if the [`generate-toc`](#the-generate-toc-task) task has been set up appropriately.

To run this task use the following command.

```bash
$ bot release
```

By default this creates a `patch` release. If you want to create a `minor` or a `major` release, provide the release type as command-line argument.

```bash
$ bot release --type minor
$ bot release --type major
```

### The `shell` task

This task lets you define shortcuts for arbitrary shell commands. E.g., if you want to automate Docker, you can define a `build` command that calls out to the Docker command-line interface.

```javascript
task('universal/shell', {
  build: 'docker build .'
});
```

To run a custom-defined task run `bot` and provide the name of the task.

```bash
$ bot build
```

### The `test` task

This task runs your unit and integration tests.

To run this task continuously, you need to configure which files to watch. This usually is a combination of your test files and your actual source code.

```javascript
task('universal/test', {
  watch: [ '**/*.js', '!node_modules/**/*.js' ]
});
```

Then run the following command.

```bash
$ bot watch-test
```

### The `test-integration` task

This task runs integration tests using [Mocha](https://mochajs.org/), where the tests need to be written as asynchronous tests using the `tdd` style.

```javascript
suite('api', () => {
  test('runs on port 80.', done => {
    ...
    done();
  });  
});
```

By default roboter assumes that you store your integration tests in the `test/integration` directory of your project. However you can specify which files contain your integration tests. For that use the `src` parameter.

```javascript
task('universal/test-integration', {
  src: 'test/integration/**/*Tests.js'
});
```

To run this task use the following command.

```bash
$ bot test-integration
```

To run this task continuously, you need to configure which files to watch. This usually is a combination of your test files and your actual source code.

```javascript
task('universal/test-integration', {
  src: 'test/integration/**/*Tests.js',
  watch: [ '**/*.js', '!node_modules/**/*.js' ]
});
```

Then run the following command.

```bash
$ bot watch-test-integration
```

If you need to register any additional pre or post actions that shall be run before or after all tests, provide the files `test/integration/pre.js` and `test/integration/post.js` in your application. They need to export an asynchronous function, as in the following example.

```javascript
'use strict';

module.exports = function (done) {
  // ...
  done(null);
};
```

In case something goes wrong, hand over the error to `done` instead of `null`.

If you need to configure where these files are located, use the `pre` and `post` properties.

```javascript
task('universal/test-integration', {
  src: 'test/integration/**/*Tests.js',
  pre: 'test/start-database.js',
  post: 'test/stop-database.js'
});
```

*Please note that the `post` task is always run, even in case of failing tests.*

### The `test-units` task

This task runs unit tests using [Mocha](https://mochajs.org/), where the tests need to be written as asynchronous tests using the `tdd` style.

```javascript
suite('Basic math', () => {
  test('1 plus 1 is 2.', done => {
    assert.that(1 + 1).is.equalTo(2);
    done();
  });  
});
```

You need to specify which files contain your tests. For that use the `src` parameter.

```javascript
task('universal/test-units', {
  src: 'test/units/**/*Tests.js'
});
```

To run this task use the following command.

```bash
$ bot test-units
```

To run this task continuously, you need to configure which files to watch. This usually is a combination of your test files and your actual source code.

```javascript
task('universal/test-units', {
  src: 'test/units/**/*Tests.js',
  watch: [ '**/*.js', '!node_modules/**/*.js' ]
});
```

Then run the following command.

```bash
$ bot watch-test-units
```

If you need to register any additional pre or post actions that shall be run before or after all tests, provide the files `test/units/pre.js` and `test/units/post.js` in your application. They need to export an asynchronous function, as in the following example.

```javascript
'use strict';

module.exports = function (done) {
  // ...
  done(null);
};
```

In case something goes wrong, hand over the error to `done` instead of `null`.

If you need to configure where these files are located, use the `pre` and `post` properties.

```javascript
task('universal/test-units', {
  src: 'test/units/**/*Tests.js',
  pre: 'test/start-database.js',
  post: 'test/stop-database.js'
});
```

*Please note that the `post` task is always run, even in case of failing tests.*

### The `unused-dependencies` task

This task looks for dependencies that are registered in the `package.json` file, but are not being used anywhere in your source code. It also looks for dependencies that are required in your source code, but have not been registered in the `package.json` file.

To run this task use the following command.

```bash
$ bot unused-dependencies
```

By default, the directory `node_modules` is excluded from the search. If you want to exclude additional directories, use the `exclude` property.

```javascript
task('universal/unused-dependencies', {
  exclude: [ 'foo/bar', 'node_modules' ]
});
```

### The `update` task

This task updates your module's dependencies.

To run this task use the following command.

```bash
$ bot update
```

By default this updates all dependencies. If you only want update a single dependency, provide the module name as command-line argument.

```bash
$ bot update --package lodash
```

If you want to update to a specific version, supply the version.

```bash
$ bot update --package lodash@4.13.1
```

*Please note that you may also specify multiple packages. If you want to do so, remember that you have to provide the `--package` option for each package individually.*

## Client tasks

### The `build-client` task

This task builds a web application and consists of two sub-tasks that can be configured individually. As this configuration is completely optional roboter will fallback to sensible default values. In order to adjust the settings configure the `client/build-app` and the `client/copy-static` task.

```javascript
task('client/build-app', {
  entryFiles: [
    'src/index.html',
    'src/index.scss',
    'src/index.js'
  ],
  babelize: [
    'src/',
    'node_modules/my-es2015-dependency'
  ],
  buildDir: 'build/',
  publicPath: '/'
});
```

The `client/build-app` task bundles your application using the given `entryFiles`. All the build assets will be transpiled and bundled into the given `buildDir`. Provide an array of strings or regular expressions via the `babelize` option to let roboter transpile `.js` and `.jsx` files via babel. During runtime your app will use `/` as the default `publicPath` when loading bundles. In other words it assumes that you publish your application into the root path of your http server.

If your application is using a nested directory structure, adjust `publicPath` to `/nested-folders/my-app-root`. If you prefer loading bundles via relative paths set `publicPath` to the empty string.

The `client/copy-static` task will copy any additional assets into the `buildDir`.

```javascript
task('client/copy-static', {
  src: 'src/static-content/**/*',
  watch: 'src/static-content/**/*',
  buildDir: 'build/'
});
```

To run the `build-client` task use the following command.

```bash
$ bot build-client
```

#### Building the various parts

By default, roboter expects three entry files for a web application: An `index.html`, an `index.scss`, and an `index.js` file (although you may also use an `index.jsx` file here). Please note that within the `index.html` file you need to reference the built JavaScript artefact. The built CSS is injected automatically:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>...</title>
  </head>
  <body>
    <script type="text/javascript" src="index.js"></script>
  </body>
</html>
```

Since roboter uses [webpack](https://webpack.github.io/) internally, you may specify the loader to be used when calling the `require` function. Currently, the following loaders are supported:

- `css`
- `file`
- `postcss`
- `raw`
- `sass`
- `style`
- `url`

#### Compiling CSS

All CSS code will automatically be parsed by [autoprefixer](https://github.com/postcss/autoprefixer).

#### Compiling JavaScript

To compile your JavaScript code using Babel, add a `.babelrc` file to your application and register the plugins and presets you want to use. E.g., to enable compilation for ES2015 and React, add the following lines:

```json
{
  "presets": [ "es2015", "react" ]
}
```

Please note that you explicitly need to install plugins and presets in order for this to work.

### The `watch-client` task

This task rebuilds a web application continuously. Additionally it starts a live-preview web server that will automatically refresh when files have been changed. By default, hot reloading is enabled for styles and React components. In order to adjust the settings used during watch mode configure the `client/watch-app` task.

```javascript
task('client/watch-app', {
  entryFiles: [
    'src/index.html',
    'src/index.scss',
    'src/index.js'
  ],
  buildDir: 'build/',
  babelize: [
    'src/',
    'node_modules/my-es2015-dependency'
  ],
  host: 'localhost',
  port: 8080,
  hotReloading: true
});
```

To finally run this task use the following command.

```bash
$ bot watch-client
```

If you use vi you have to set the following configuration value for the watch mode to work.

```bash
:set backupcopy=yes
```

## Server tasks

### The `build-server` task

This task runs code analysis and unit tests on your code as defined by the `analyze` and `test-units` tasks.

To run this task use the following command.

```bash
$ bot build-server
```

### The `watch-server` task

This task runs your unit tests continuously as defined by the `test-units` tasks.

To run this task use the following command.

```bash
$ bot watch-server
```

If you use vi you have set the following configuration value for the watch mode to work.

```bash
:set backupcopy=yes
```

## Using the default task

No matter whether you are working on the client or on the server, roboter provides a meaningful `default` task.

- On the client, it is equivalent to the `watch-client` task.
- On the server, it is equivalent to the `build-server` task.

To run the `default` task, simply run `bot` without any further parameters.

```bash
$ bot
```

## Running the tests

To run the tests run the following command.

```bash
$ npm run test
```

## Running the build

Unfortunately, this module can not be used to build itself. Hence you have to use `npm` for that.

To analyze the source code run the following command.

```bash
$ npm run analyze
```

To release a new version run the following command.

```bash
$ npm run publish-patch
```

Alternatively you may also use `publish-minor` and `publish-major`, depending on the changes you have made.

## License

The MIT License (MIT)
Copyright (c) 2015-2016 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
