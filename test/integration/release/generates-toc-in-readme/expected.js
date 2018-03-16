'use strict';

const fs = require('fs'),
      path = require('path');

const assert = require('assertthat'),
      promisify = require('util.promisify');

const readFile = promisify(fs.readFile);

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const readMe = await readFile(path.join(dirname, 'README.md'), 'utf8');

  assert.that(readMe).is.containing(`<!-- toc -->

- [Installation](#installation)
- [Quick start](#quick-start)
- [License](#license)

<!-- tocstop -->

## Installation

## Quick start

## License`);
};

module.exports = { exitCode, stdout, stderr, validate };
