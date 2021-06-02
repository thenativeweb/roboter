import { assert } from 'assertthat';

suite('sample', (): void => {
  test('does not fail.', async (): Promise<void> => {
    assert.that(true).is.true();
  });
});
