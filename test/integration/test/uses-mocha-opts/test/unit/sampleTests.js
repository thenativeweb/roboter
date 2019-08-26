'use strict';

const assert = require('assertthat').default;

suite('sample', () => {
  test('does not fail but is long running.', done => {
    setTimeout(() => {
      assert.that(true).is.true();
      done();
    }, 3 * 1000);
  });
});
