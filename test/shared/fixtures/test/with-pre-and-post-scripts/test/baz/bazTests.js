'use strict';

const { assert } = require('assertthat');

suite('baz', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
