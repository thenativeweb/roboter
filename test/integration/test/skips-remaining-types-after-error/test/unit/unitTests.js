'use strict';

const assert = require('assertthat').default;

suite('unit', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
