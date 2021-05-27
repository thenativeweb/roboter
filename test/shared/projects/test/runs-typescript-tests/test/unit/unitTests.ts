import { assert } from 'assertthat';

suite('typescript unit tests', (): void => {
  test('run successfully.', async (): Promise<void> => {
    assert.that(true).is.true();
  });
});
