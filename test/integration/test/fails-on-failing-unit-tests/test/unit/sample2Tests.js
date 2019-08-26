'use strict';

const assert = require('assertthat').default;

suite('sample2', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
