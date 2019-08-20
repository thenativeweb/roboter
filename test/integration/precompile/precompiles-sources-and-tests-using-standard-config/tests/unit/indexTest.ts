import assert from 'assertthat';

suite('index', (): void => {
    test('test something.', async (): Promise<void> => {
        assert.that(true).is.true();
    });
});
