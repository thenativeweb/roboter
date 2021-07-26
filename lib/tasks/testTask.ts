import { buntstift } from 'buntstift';
import chokidar from 'chokidar';
import { DependencyGraph } from '../types/DependencyGraph';
import { fileExists } from '../utils/fileExists';
import { getGitIgnore } from '../steps/git/getGitIgnore';
import { getSubDirectoryNames } from '../utils/getSubDirectoryNames';
import { globby } from 'globby';
import minimatch from 'minimatch';
import normalize from 'normalize-path';
import path from 'path';
import { TestRunner } from '../runner/TestRunner';
import { updateDependencyGraph } from '../steps/test/updateDependencyGraph';
import { Result, value } from 'defekt';
import * as errors from '../errors';

const supportedFileExtensions = [ 'ts', 'tsx', 'js', 'jsx' ];

const testTask = async function ({ applicationRoot, type, bail, watch, grep }: {
  applicationRoot: string;
  type?: string;
  bail: boolean;
  watch: boolean;
  grep?: RegExp;
}): Promise<Result<undefined, errors.TestsFailed>> {
  buntstift.line();
  buntstift.info(`Running tests...`, { prefix: '▸' });

  const absoluteTestDirectory = path.join(applicationRoot, 'test');
  const doesTestDirectoryExist = await fileExists({
    absoluteFile: absoluteTestDirectory
  });

  if (!doesTestDirectoryExist) {
    buntstift.line();
    buntstift.warn('No test directory found, skipping tests.');

    return value();
  }

  const ignoredDirectories = new Set([ 'shared' ]),
        preferredTypes = [ 'unit', 'component', 'integration', 'e2e', 'performance' ];
  let types = [ type ?? await getSubDirectoryNames({ directory: absoluteTestDirectory }) ].flat();

  types = types.filter((currentType): boolean => !ignoredDirectories.has(currentType));

  preferredTypes.reverse().forEach((preferredType): void => {
    const index = types.indexOf(preferredType);

    if (index !== -1) {
      types.splice(index, 1);
      types.unshift(preferredType);
    }
  });

  const testGlobs: Record<string, string[]> = {};

  for (const testType of types) {
    testGlobs[testType] = supportedFileExtensions.map(
      (fileExtension): string =>
        path.posix.join(normalize(applicationRoot), 'test', testType, '**', `*Tests.${fileExtension}`)
    );
  }

  const testRunner = new TestRunner({
    applicationRoot,
    bail,
    watch
  });

  const absoluteTestFilesPerType: Record<string, string[]> = {};

  for (const [ testType, globs ] of Object.entries(testGlobs)) {
    absoluteTestFilesPerType[testType] = await globby(globs, {
      absolute: true,
      onlyFiles: true
    });
  }

  if (!watch) {
    const testResult = await testRunner.run({
      absoluteTestFilesPerType,
      typeSequence: types,
      grep
    });

    if (testResult.hasError()) {
      buntstift.error('Tests failed.');

      return testResult;
    }

    buntstift.line();
    buntstift.success('Tests successful.');

    return value();
  }

  const gitIgnore = await getGitIgnore({ applicationRoot });

  const graph = new DependencyGraph();
  const staleFiles: string[] = [];

  for (const [ , absoluteTestFiles ] of Object.entries(absoluteTestFilesPerType)) {
    for (const absoluteTestFile of absoluteTestFiles) {
      graph.addRoot(absoluteTestFile);
      staleFiles.push(absoluteTestFile);
    }
  }

  await updateDependencyGraph({ graph, staleFiles });

  const fileWatcher = chokidar.watch(
    supportedFileExtensions.map(
      (fileExtension): string =>
        path.join(applicationRoot, '**', `*.${fileExtension}`)
    ),
    {
      ignored: [
        ...gitIgnore,
        'node_modules',
        '.git'
      ],
      persistent: true
    }
  );

  await new Promise((resolve): void => {
    fileWatcher.on('ready', resolve);
  });

  fileWatcher.on('unlink', async (absoluteDeletedFile): Promise<void> => {
    if (graph.hasRoot(absoluteDeletedFile)) {
      graph.removeRoot(absoluteDeletedFile);
    }
    if (graph.hasNode(absoluteDeletedFile)) {
      graph.removeNode(absoluteDeletedFile);
    }
  });

  fileWatcher.on('add', async (absoluteNewFile): Promise<void> => {
    if (
      Object.values(testGlobs).some(
        (testTypeGlobs): boolean => testTypeGlobs.some(
          (testTypeGlob): boolean => minimatch(absoluteNewFile, testTypeGlob)
        )
      )
    ) {
      graph.addRoot(absoluteNewFile);
      staleFiles.push(absoluteNewFile);
    }
    if (graph.hasNode(absoluteNewFile)) {
      staleFiles.push(absoluteNewFile);
    }
    await updateDependencyGraph({ graph, staleFiles });

    if (graph.hasNode(absoluteNewFile)) {
      const absoluteRelevantTestFiles = graph.findRoots(absoluteNewFile).unwrapOrThrow();
      const absoluteRelevantTestFilesPerType: Record<string, string[]> = {};

      for (const absoluteRelevantTestFile of absoluteRelevantTestFiles) {
        for (const [ testType, globs ] of Object.entries(testGlobs)) {
          if (globs.some((glob): boolean => minimatch(absoluteRelevantTestFile, glob))) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!absoluteRelevantTestFilesPerType[testType]) {
              absoluteRelevantTestFilesPerType[testType] = [];
            }
            absoluteRelevantTestFilesPerType[testType].push(absoluteRelevantTestFile);
          }
        }
      }

      await testRunner.abort();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      testRunner.run({
        absoluteTestFilesPerType: absoluteRelevantTestFilesPerType,
        typeSequence: types,
        grep
      });
    } else {
      buntstift.info('No relevant test suites found; skipped re-execution.');
    }
  });

  fileWatcher.on('change', async (absoluteChangedFile): Promise<void> => {
    if (graph.hasNode(absoluteChangedFile)) {
      staleFiles.push(absoluteChangedFile);
    }

    await updateDependencyGraph({ graph, staleFiles });

    if (graph.hasNode(absoluteChangedFile)) {
      const absoluteRelevantTestFiles = graph.findRoots(absoluteChangedFile).unwrapOrThrow();
      const absoluteRelevantTestFilesPerType: Record<string, string[]> = {};

      for (const absoluteRelevantTestFile of absoluteRelevantTestFiles) {
        for (const [ testType, globs ] of Object.entries(testGlobs)) {
          if (globs.some((glob): boolean => minimatch(absoluteRelevantTestFile, glob))) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (!absoluteRelevantTestFilesPerType[testType]) {
              absoluteRelevantTestFilesPerType[testType] = [];
            }
            absoluteRelevantTestFilesPerType[testType].push(absoluteRelevantTestFile);
          }
        }
      }

      await testRunner.abort();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      testRunner.run({
        absoluteTestFilesPerType: absoluteRelevantTestFilesPerType,
        typeSequence: types,
        grep
      });
    } else {
      buntstift.info('No relevant test suites found; skipped re-execution.');
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  testRunner.run({
    absoluteTestFilesPerType,
    typeSequence: types,
    grep
  });

  return new Promise((resolve): void => {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }

    process.stdin.setEncoding('utf-8');
    process.stdin.resume();
    process.stdin.on('data', async (key: string): Promise<void> => {
      if (key === 'q' || key === '\u0003') {
        buntstift.info('Quitting...');
        await testRunner.abort();
        await fileWatcher.close();

        process.stdin.setRawMode(false);
        process.stdin.removeAllListeners('data');
        process.stdin.destroy();

        return resolve(value());
      }
      if (key === 's') {
        await testRunner.abort();
      }
      if (key === 'r') {
        buntstift.info('Rerunning all tests...');
        await testRunner.abort();
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        testRunner.run({
          absoluteTestFilesPerType,
          typeSequence: types,
          grep
        });
      }
    });
  });
};

export {
  testTask
};
