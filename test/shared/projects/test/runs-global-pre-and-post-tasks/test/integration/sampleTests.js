'use strict';

const { assert } = require('assertthat');

suite('sample', () => {
  test('does not fail.', done => {
    /* eslint-disable no-console */
    console.log('Hello from integration test!');
    /* eslint-enable no-console */

    assert.that(true).is.true();
    done();
  });
});
