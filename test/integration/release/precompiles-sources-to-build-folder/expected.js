'use strict';

const fs = require('fs'),
      path = require('path'),
      { promisify } = require('util');

const assert = require('assertthat').default,
      isolated = require('isolated').default,
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const readFile = promisify(fs.readFile);

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/build/index.js ${tempDirectory}`);

  const builtFile = await readFile(path.join(tempDirectory, 'index.js'), { encoding: 'utf8' });

  assert.that(builtFile.trim()).is.equalTo(stripIndent`
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const foo = 'bar';
    exports.default = foo;
  `.trim());
};

module.exports = { exitCode, stdout, stderr, validate };
