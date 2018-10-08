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

    const React = require('react');

    const Bar = () => React.createElement("div", null);

    const foo = React.createElement(Bar, null);
    module.exports = foo;`);
};

module.exports = { exitCode, stdout, stderr, validate };
