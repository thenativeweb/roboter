'use strict';

const assert = require('assertthat');

suite('unit', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
