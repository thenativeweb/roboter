'use strict';

const { assert } = require('assertthat');

suite('baz', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
