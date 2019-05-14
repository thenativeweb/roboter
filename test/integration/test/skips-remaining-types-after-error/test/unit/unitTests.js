'use strict';

const assert = require('assertthat');

suite('unit', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
