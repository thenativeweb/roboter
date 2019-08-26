'use strict';

const assert = require('assertthat').default;

suite('baz', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
