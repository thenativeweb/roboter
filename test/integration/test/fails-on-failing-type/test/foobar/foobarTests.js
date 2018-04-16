'use strict';

const assert = require('assertthat');

suite('foobar', () => {
  test('does not fail.', done => {
    assert.that(true).is.true();
    done();
  });
});
