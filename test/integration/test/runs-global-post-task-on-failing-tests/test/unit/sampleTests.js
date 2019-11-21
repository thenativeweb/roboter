'use strict';

const { assert } = require('assertthat');

suite('sample', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
