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

  const precompiledFile = shell.cat(path.join(dirname, 'dist', 'index.js'));

  assert.that(precompiledFile.stdout).is.equalTo(stripIndent`
    'use strict';

    var foo = 'bar';

    module.exports = foo;`);
};

module.exports = { exitCode, stdout, stderr, validate };
