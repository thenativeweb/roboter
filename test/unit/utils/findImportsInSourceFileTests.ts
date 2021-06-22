import { assert } from 'assertthat';
import { fileURLToPath } from 'url';
import { findImportsInSourceFile } from '../../../lib/utils/findImportsInSourceFile';
import path from 'path';

const dirname = path.dirname(fileURLToPath(import.meta.url));

suite('findImportsInSourceFileTests', (): void => {
  test('finds typescript imports successfully.', async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const absoluteTypeScriptSourceAFile = path.join(dirname, '..', '..', 'shared', 'sources', 'a.ts');

    const findImportsResult = await findImportsInSourceFile({ filePath: absoluteTypeScriptSourceAFile });

    assert.that(findImportsResult).is.aValue();

    const expectedTargetSourceFiles = new Set([
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.ts'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.tsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.ts'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.tsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.js'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.jsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.js'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.jsx')
    ]);

    assert.that(findImportsResult.unwrapOrThrow()).is.equalTo(expectedTargetSourceFiles);
  });

  test('finds javascript requires successfully.', async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const absoluteJavaScriptSourceAFile = path.join(dirname, '..', '..', 'shared', 'sources', 'a.js');

    const findImportsResult = await findImportsInSourceFile({ filePath: absoluteJavaScriptSourceAFile });

    assert.that(findImportsResult).is.aValue();

    const expectedTargetSourceFiles = new Set([
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.ts'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.tsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.ts'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.tsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.js'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.jsx'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.js'),
      path.join(dirname, '..', '..', 'shared', 'sources', 'b', 'index.jsx')
    ]);

    assert.that(findImportsResult.unwrapOrThrow()).is.equalTo(expectedTargetSourceFiles);
  });

  test('handles imports with extension successfully.', async (): Promise<void> => {
    const absoluteTypeScriptSourceFile = path.join(dirname, '..', '..', 'shared', 'sources', 'importWithExtension.ts');

    const findImportsResult = await findImportsInSourceFile({ filePath: absoluteTypeScriptSourceFile });

    assert.that(findImportsResult).is.aValue();

    const expectedTargetSourceFiles = new Set([
      path.join(dirname, '..', '..', 'shared', 'sources', 'b.ts')
    ]);

    assert.that(findImportsResult.unwrapOrThrow()).is.equalTo(expectedTargetSourceFiles);
  });
});
