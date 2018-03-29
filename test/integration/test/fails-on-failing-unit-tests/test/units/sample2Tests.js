'use strict';

const assert = require('assertthat');

suite('sample2', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
