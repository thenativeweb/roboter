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

  const precompiledFile = shell.cat(path.join(dirname, 'build', 'index.js'));

  assert.that(precompiledFile.stdout.trim()).is.equalTo(stripIndent`
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const foo = 'bar';
    exports.default = foo;
  `.trim());
};

module.exports = { exitCode, stdout, stderr, validate };
