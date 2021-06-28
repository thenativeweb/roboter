import { getPackageJson } from '../../utils/getPackageJson';
import { PackageJson } from 'type-fest';

interface Dependency {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies';
}

const getNonStrictDependencies = function ({ packageJson, type }: {
  packageJson: PackageJson;
  type: 'dependencies' | 'devDependencies';
}): Dependency[] {
  const nonStrictDependencies: Dependency[] = [];

  for (const [ name, version ] of Object.entries(packageJson[type] ?? {})) {
    // Only check for ^ and ~ in the beginning of a version number to anticipate
    // the usual npm non-strict mode problems. If someone actually explicitly
    // uses a range or a wildcard (or also a link to GitHub) as version, this
    // should be fine. The goal of this step is to find the accidental errors,
    // not to punish users for explicit decisions.
    if (version.startsWith('^') || version.startsWith('~')) {
      nonStrictDependencies.push({ name, version, type });
    }
  }

  return nonStrictDependencies;
};

const findNonStrictDependencies = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<Dependency[]> {
  // This can not fail (under usual circumstances) since the application root of
  // a package is determined by the existence of a package.json file.
  const packageJson = (await getPackageJson({ applicationRoot })).unwrapOrThrow();

  const dependencies = getNonStrictDependencies({
    packageJson,
    type: 'dependencies'
  });

  const devDependencies = getNonStrictDependencies({
    packageJson,
    type: 'devDependencies'
  });

  return [ ...dependencies, ...devDependencies ];
};

export {
  findNonStrictDependencies
};

