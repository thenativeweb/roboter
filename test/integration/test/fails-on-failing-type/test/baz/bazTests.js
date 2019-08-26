'use strict';

const assert = require('assertthat').default;

suite('baz', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
