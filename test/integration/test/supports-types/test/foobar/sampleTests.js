'use strict';

const assert = require('assertthat');

suite('sample', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
