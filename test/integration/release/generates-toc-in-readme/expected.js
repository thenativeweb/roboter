'use strict';

const path = require('path');

const assert = require('assertthat'),
      isolated = require('isolated'),
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/README.md ${tempDirectory}`);

  const readMe = shell.cat(path.join(tempDirectory, 'README.md'));

  assert.that(readMe.stdout).is.containing(stripIndent`

    -   [Installation](#installation)
    -   [Quick start](#quick-start)
    -   [License](#license)

    ## Installation

    ## Quick start

    ## License`);
};

module.exports = { exitCode, stdout, stderr, validate };
