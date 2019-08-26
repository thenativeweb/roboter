'use strict';

const assert = require('assertthat').default;

suite('sample1', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
