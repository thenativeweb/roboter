import { assert } from 'assertthat';

suite('someIntegration', (): void => {
  test('test something.', async (): Promise<void> => {
    assert.that(true).is.true();
  });
});
