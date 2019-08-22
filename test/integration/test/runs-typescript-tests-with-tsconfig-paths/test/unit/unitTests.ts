import assert from 'assertthat';
import foo from '@blub';

suite('typescript unit tests', (): void => {
  test('run successfully', async (): Promise<void> => {
    assert.that(foo()).is.true();
  })
});
