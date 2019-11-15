import { assert } from 'assertthat';
import data from '../shared/something.json';

suite('typescript unit tests', (): void => {
  test('run successfully.', async (): Promise<void> => {
    assert.that(data.foo).is.equalTo('bar');
  });
});
