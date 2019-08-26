'use strict';

const assert = require('assertthat').default;

suite('sample', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
