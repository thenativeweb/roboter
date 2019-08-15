'use strict';

const path = require('path');

const assert = require('assertthat'),
      isolated = require('isolated'),
      shell = require('shelljs');

const exitCode = 0;

const stdout = '';

const stderr = '';

const validate = async function ({ container }) {
  const tempDirectory = await isolated();

  shell.exec(`docker cp ${container}:/home/node/app/package.json ${tempDirectory}`);

  /* eslint-disable global-require */
  const packageJson = require(path.join(tempDirectory, 'package.json'));
  /* eslint-enable global-require */

  assert.that(packageJson.version).is.equalTo('1.0.0');

  // TODO: @Hannes ... actually, I didn't have an idea of how to make this work,
  //       without copying over *everything*, which takes forever ;-)
  //       Hence, I just wanted to leave a comment here, so that we can discuss
  //       this tomorrow.
  //
  // const listTags = shell.exec('git tag -l', { cwd: tempDirectory });
  // const tags = listTags.stdout.split('\n');
  //
  // assert.that(tags[0]).is.equalTo('1.0.0');
};

module.exports = { exitCode, stdout, stderr, validate };
