import depcheck from 'depcheck';
import { error, Result, value } from 'defekt';
import * as errors from '../../errors';

const checkForUnusedDependencies = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Result<undefined, errors.UnusedDependencies>> {
  const depcheckOptions = {
    ignoreDirs: [ 'node_modules' ],
    ignoreMatches: [
      '@types/*',
      'npm-package-json-lint-config-tnw',
      'react',
      'roboter',
      'semantic-release-configuration',
      'ts-node',
      'tsconfig-paths',
      'typescript'
    ],
    parsers: {
      '**/*.js': depcheck.parser.es6,
      '**/*.jsx': depcheck.parser.jsx,
      '**/*.ts': depcheck.parser.typescript,
      '**/*.tsx': depcheck.parser.typescript
    },
    detectors: [
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration
    ],
    specials: [
      depcheck.special.babel,
      depcheck.special.bin,
      depcheck.special.eslint,
      depcheck.special.mocha,
      depcheck.special.webpack
    ]
  };

  const {
    invalidDirs,
    invalidFiles,
    dependencies,
    devDependencies
  } = await depcheck(applicationRoot, depcheckOptions);

  if (invalidFiles.length > 0) {
    throw new errors.FileParsingFailed(`Unable to parse some files: ${invalidFiles.join(', ')}`);
  }

  if (invalidDirs.length > 0) {
    throw new errors.DirectoryAccessFailed(`Unable to access some directories: ${invalidDirs.join(', ')}`);
  }

  if (dependencies.length > 0 || devDependencies.length > 0) {
    const allUnusedDeps = [ ...dependencies, ...devDependencies ];

    return error(new errors.UnusedDependencies(`The following dependencies are unused or missing:\n\n${allUnusedDeps.join(',\n')}`));
  }

  return value();
};

export {
  checkForUnusedDependencies
};
