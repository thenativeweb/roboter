import assert from 'assertthat';

suite('typescript unit tests', (): void => {
  test('run successfully.', async (): Promise<void> => {
    /* eslint-disable no-console */
    console.log('typescript');
    /* eslint-enable no-console */
    assert.that(true).is.true();
  });
});
