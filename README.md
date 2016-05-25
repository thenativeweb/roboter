# roboter

roboter automates your build.

![roboter](https://github.com/thenativeweb/roboter/raw/master/images/logo.jpg "roboter")

## Installation

### As Node.js module

```bash
$ npm install roboter
```

*Please note that roboter requires Node.js 6.2.0 or higher.*

### As CLI

```bash
$ npm install -g roboter
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

If you want to get an overview of all available tasks, simply run `bot` without any parameters.

```bash
$ bot
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
- [`outdated`](#the-outdated-task)
- [`release`](#the-release-task)
- [`shell`](#the-shell-task)
- [`test`](#the-test-task)
- [`test-integration`](#the-test-integration-task)
- [`test-units`](#the-test-units-task)
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

### The `outdated` task

This task verifies whether all of your dependencies and development dependencies are up-to-date.

To run this task use the following command.

```bash
$ bot outdated
```

### The `release` task

This task publishes your project. Before publishing it, the task also runs the code analysis and the tests, and checks whether your Git repositoriy is up-to-date.

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

### The `update` task

This task updates your module's dependencies.

To run this task use the following command.

```bash
$ bot update
```

By default this updates all dependencies. If you only want update a single dependency, provide the module name as command-line argument.

```bash
$ bot update --module lodash
```

## Client tasks

### The `build-client` task

This task builds a web application and consists of several sub-tasks that can be configured individually. As this configuration is completely optional roboter will fallback to sensible default values.

```javascript
task('client/clean-client', {
  buildDir: 'build/**/*'
});

task('client/build-html', {
  src: 'src/**/*.html',
  buildDir: 'build/'
});

task('client/build-themes', {
  baseDir: 'src/themes/',
  entryFiles: 'src/themes/**/theme.scss',
  assets: [ 'src/themes/**/*.png', '!src/themes/**/*.scss' ],
  buildDir: 'build/themes/'
});

task('client/build-scripts', {
  baseDir: 'src/',
  entryFile: 'index.js',
  buildDir: 'build/',
  outputFile: 'app.js'
});

task('client/copy-static', {
  src: 'src/static-content/**/*',
  watch: 'src/static-content/**/*',
  buildDir: 'build/'
});
```

To run this task use the following command.

```bash
$ bot build-client
```

#### Building the various parts

Building HTML means copying files from one directory to another. You can use [preprocess](https://github.com/jsoverson/preprocess) and its [directive syntax](https://github.com/jsoverson/preprocess#directive-syntax) to include and exclude HTML content based on ENV variables.

When building client applications roboter assumes that you want your application to be themable by default. If you do not want this just use a `default` theme. Anyway, all of your themes are compiled using [Sass](http://sass-lang.com/).

Additionally, if you create an `icons` folder within a theme and put `.svg` files into it, they will be optimized using [svgo](https://github.com/svg/svgo), copied to the build directory, and additionally be compiled into a single JavaScript file called `icons.js`. This way you can use the `.svg` files individually or inject them as inline SVG.

Building the scripts means compiling JavaScript using [Browserify](http://browserify.org/), [envify](https://github.com/hughsk/envify) and [Babel](https://babeljs.io/).

Please note that you need to explicitly install and configure presets in order to tell the `build-scripts` task which language features to support. If you want to use ES2015 you need to install [`babel-preset-es2015`](https://www.npmjs.com/package/babel-preset-es2015) inside your project and configure it via the `babel.presets` option.

```javascript
task('client/build-scripts', {
  baseDir: 'src/',
  entryFile: 'index.js',
  babel: {
    presets: [ 'es2015' ]
  },
  buildDir: 'build/',
  outputFile: 'app.js'
});
```

### The `watch-client` task

This task rebuilds a web application continuously. Additionally it starts a [live-preview server](http://www.browsersync.io/) that will automatically refresh when files have been changed.

Additionally to the aforementioned configuration you now also have to define the `watch` property for the `build-html` and `build-themes` tasks. Additionally, you have to configure the `serve-client` task.

```javascript
task('client/build-html', {
  ...,
  watch: 'src/**/*.html'
});

task('client/build-themes', {
  ...,
  watch: 'src/themes/**/*'
});

task('client/serve-client', {
  baseDir: 'build/',
  watch: [ 'build/**/*' ],
  port: 3000
});
```

To finally run this task use the following command.

```bash
$ bot watch-client
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

## Using the default task

No matter whether you are working on the client or on the server, roboter provides a meaningful `default` task.

- On the client, it is equivalent to the `watch-client` task.
- On the server, it is equivalent to the `build-server` task.

To run the `default` task, simply run `bot` without any further parameters.

```bash
$ bot
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
