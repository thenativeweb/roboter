'use strict';

const roboter = require('../../lib/roboter');

const assert = require('assertthat');

suite('roboter', function () {
  test('is an object', function (done) {
    assert.that(roboter).is.ofType('object');
    done();
  });
});
