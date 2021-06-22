'use strict';

const { assert } = require('assertthat');

const number = require('../../lib/lib');

suite('sample', () => {
  test('does not fail.', done => {
    assert.that(number).is.equalTo(5);
    done();
  });
});
