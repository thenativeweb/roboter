'use strict';

const assert = require('assertthat');

suite('units', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
