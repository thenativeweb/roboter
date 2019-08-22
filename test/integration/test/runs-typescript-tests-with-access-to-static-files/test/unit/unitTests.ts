import data from '../shared/something.json';
import assert from 'assertthat';

suite('typescript unit tests', (): void => {
  test('run successfully', async (): Promise<void> => {
    assert.that(data.foo).is.equalTo("bar");
  })
});
