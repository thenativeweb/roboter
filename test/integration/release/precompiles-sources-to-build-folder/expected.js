'use strict';

const fs = require('fs'),
      path = require('path');

const { assert } = require('assertthat'),
      stripIndent = require('common-tags/lib/stripIndent');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ directory }) {
  const builtFile = await fs.promises.readFile(path.join(directory, 'build', 'index.js'), { encoding: 'utf8' });

  assert.that(builtFile.trim()).is.equalTo(stripIndent`
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const foo = 'bar';
    exports.default = foo;
  `.trim());
};

module.exports = { exitCode, stdout, stderr, validate };
