'use strict';

const assert = require('assertthat').default;

suite('e2e', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
