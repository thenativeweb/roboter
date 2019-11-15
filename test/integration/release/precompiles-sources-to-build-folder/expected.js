'use strict';

const fs = require('fs'),
      path = require('path');

const { assert } = require('assertthat'),
      { isolated } = require('isolated'),
      shell = require('shelljs'),
      stripIndent = require('common-tags/lib/stripIndent');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/build/index.js ${tempDirectory}`);

  const builtFile = await fs.promises.readFile(path.join(tempDirectory, 'index.js'), { encoding: 'utf8' });

  assert.that(builtFile.trim()).is.equalTo(stripIndent`
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const foo = 'bar';
    exports.default = foo;
  `.trim());
};

module.exports = { exitCode, stdout, stderr, validate };
