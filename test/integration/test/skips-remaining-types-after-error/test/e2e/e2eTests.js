'use strict';

const assert = require('assertthat');

suite('e2e', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
