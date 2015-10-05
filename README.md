# roboter

roboter automates your build.

![roboter](https://github.com/thenativeweb/roboter/raw/master/images/logo.jpg "roboter")

## Installation

### As Node.js module

    $ npm install roboter gulp

Please note that this module depends on a *locally* installed gulp which *must* be a direct dependency of your application. Hence make sure that you always run the above command to install both modules.

### As CLI

    $ npm install -g roboter

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

## Using tasks

Before using tasks you need to select an environment, i.e. whether you are working on a `client` or a `server` project. For that provide the name of the environment to the `workOn` function.

The environment you select defines what tasks are available to you. The exception to the rule are the *universal* tasks that are available independent of the selected environment.

### Universal tasks

#### The `analyze` task

This tasks runs static code analysis on your source files. You only need to specify which files to analyse. For that use the `src` parameter.

```javascript
task('universal/analyze', {
  src: [ '**/*.js', '!node_modules/**/*.js' ]
});
```

By default, the `analyze` task uses a built-in rule set, but you may override it by specifying the path to an ESLint configuration file using the `rules` property.

```javascript
task('universal/analyze', {
  src: [ '**/*.js', '!node_modules/**/*.js' ],
  rules: '.eslintrc'
});
```

To run this task use the following command.

```bash
$ bot analyze
```

To run this task continuously run the following command.

```bash
$ bot watch-analyze
```

#### The `outdated` task

This tasks verifies whether all of your dependencies and development dependencies are up-to-date.

To run this task use the following command.

```bash
$ bot outdated
```

### Client tasks

### Server tasks

## Running the build

Unfortunately, this module can not be used to build itself. Hence you have to use `npm` for that.

    $ npm run publish-patch

Alternative you may also use `publish-minor` and `publish-major`, depending on the changes you have made.

## License

The MIT License (MIT)
Copyright (c) 2015 the native web.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
