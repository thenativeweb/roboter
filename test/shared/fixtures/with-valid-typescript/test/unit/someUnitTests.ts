import { assert } from 'assertthat';

suite('someUnit', (): void => {
  test('test something.', async (): Promise<void> => {
    assert.that(true).is.true();
  });
});
