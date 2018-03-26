'use strict';

const path = require('path');

const assert = require('assertthat'),
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function (options) {
  const { dirname } = options;

  const readMe = shell.cat(path.join(dirname, 'README.md'));

  assert.that(readMe.stdout).is.containing(stripIndent`
    <!-- toc -->

    - [Installation](#installation)
    - [Quick start](#quick-start)
    - [License](#license)

    <!-- tocstop -->

    ## Installation

    ## Quick start

    ## License`);
};

module.exports = { exitCode, stdout, stderr, validate };
