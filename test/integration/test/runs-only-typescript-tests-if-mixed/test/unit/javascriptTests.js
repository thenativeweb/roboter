'use strict';

const assert = require('assertthat').default;

suite('typescript unit tests', () => {
  test('run successfully.', async () => {
    /* eslint-disable no-console */
    console.log('javascript');
    /* eslint-enable no-console */
    assert.that(true).is.true();
  });
});
