'use strict';

const { assert } = require('assertthat');

suite('sample', () => {
  test('does not fail.', async () => {
    /* eslint-disable no-process-env */
    assert.that(process.env.SOME_ENV).is.equalTo('bar');
    /* eslint-enable no-process-env */
  });
});
