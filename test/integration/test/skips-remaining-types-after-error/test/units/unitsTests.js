'use strict';

const assert = require('assertthat');

suite('units', () => {
  test('fails.', done => {
    assert.that(true).is.false();
    done();
  });
});
