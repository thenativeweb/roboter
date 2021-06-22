import estraverse from 'estraverse';
import ESTree from 'estree';
import fs from 'fs';
import { parse } from '@typescript-eslint/typescript-estree';
import path from 'path';
import { error, Result, value } from 'defekt';
import * as errors from '../errors';

const mergeCollections = function<T>(collectionOne: Set<T>, collectionTwo: Set<T>): Set<T> {
  return new Set<T>([ ...collectionOne, ...collectionTwo ]);
};

const isImportDeclaration = function (node: ESTree.Node): node is ESTree.ImportDeclaration {
  return node.type === 'ImportDeclaration' &&
        'value' in node.source &&
        (node.source.value as string).startsWith('.');
};

const isDynamicImport = function (node: ESTree.Node): node is ESTree.ImportExpression {
  return node.type === 'ImportExpression';
};

const isNodeRequireCall = function (node: ESTree.Node): node is ESTree.CallExpression {
  return node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require';
};

const handleImportDeclaration = function ({
  node,
  filePath
}: {
  node: ESTree.Node;
  filePath: string;
}): Set<string> {
  const importedFiles = new Set<string>();
  const fileDirectory = path.dirname(filePath);

  let relativeImportedFile: string;

  switch (node.type) {
    case 'ImportExpression': {
      const importArgument = node.source;

      if (
        importArgument.type !== 'Literal' ||
                typeof importArgument.value !== 'string'
      ) {
        return importedFiles;
      }

      relativeImportedFile = importArgument.value;
      break;
    }
    case 'ImportDeclaration': {
      if (typeof node.source.value !== 'string') {
        return importedFiles;
      }

      relativeImportedFile = node.source.value;
      break;
    }
    case 'CallExpression': {
      const argument = node.arguments[0];

      if (argument.type !== 'Literal' || typeof argument.value !== 'string') {
        return importedFiles;
      }

      relativeImportedFile = argument.value;
      break;
    }
    default: {
      return importedFiles;
    }
  }

  // If an import does not start with a '.', it is a module name and not a
  // relative path. We want to ignore modules.
  if (!relativeImportedFile.startsWith('.')) {
    return importedFiles;
  }

  const absoluteImportedFile = path.join(fileDirectory, relativeImportedFile);

  if ([ '.ts', '.tsx', '.js', '.jsx' ].some(
    (extension): boolean => absoluteImportedFile.endsWith(extension)
  )
  ) {
    return new Set([ absoluteImportedFile ]);
  }

  return new Set([
    `${absoluteImportedFile}.tsx`,
    path.join(absoluteImportedFile, 'index.tsx'),
    `${absoluteImportedFile}.ts`,
    path.join(absoluteImportedFile, 'index.ts'),
    `${absoluteImportedFile}.jsx`,
    path.join(absoluteImportedFile, 'index.jsx'),
    `${absoluteImportedFile}.js`,
    path.join(absoluteImportedFile, 'index.js')
  ]);
};

const findImportsInSourceFile = async function ({
  filePath
}: {
  filePath: string;
}): Promise<Result<Set<string>, errors.CouldNotAnalyseSourceFile>> {
  try {
    const code = await fs.promises.readFile(filePath, 'utf-8');
    const ast = parse(code, { jsx: true, loc: true });

    let allImportedstrings = new Set<string>();

    estraverse.traverse(
      ast as ESTree.Node,
      {
        fallback: 'iteration',
        enter (node): void {
          if (isImportDeclaration(node) || isDynamicImport(node) || isNodeRequireCall(node)) {
            const importedFiles = handleImportDeclaration({ node, filePath });

            allImportedstrings = mergeCollections<string>(
              allImportedstrings,
              importedFiles
            );
          }
        }
      }
    );

    return value(allImportedstrings);
  } catch (ex: unknown) {
    return error(new errors.CouldNotAnalyseSourceFile({ cause: ex }));
  }
};

export {
  findImportsInSourceFile
};
