import assert from 'assertthat';
import React from 'react';

suite('tsx unit tests', (): void => {
  test('run successfully.', async (): Promise<void> => {
    assert.that(true).is.true();
    assert.that(<div></div>).is.not.undefined();
  });
});
