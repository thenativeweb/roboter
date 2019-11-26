'use strict';

const path = require('path');

const { assert } = require('assertthat'),
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  const readMe = shell.cat(path.join(directory, 'README.md'));

  assert.that(readMe.stdout).is.containing(stripIndent`

    -   [Installation](#installation)
    -   [Quick start](#quick-start)
    -   [License](#license)

    ## Installation

    ## Quick start

    ## License`);
};

module.exports = { exitCode, stdout, stderr, validate };
