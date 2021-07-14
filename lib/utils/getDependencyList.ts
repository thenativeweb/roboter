import { getPackageJson } from './getPackageJson';
import path from 'path';
import { EntryType, walk } from 'walk-file-tree';

const getAbsoluteDependencyDirectoryList = async function ({ absoluteDirectory }: {
  absoluteDirectory: string;
}): Promise<string[]> {
  const absoluteDependencyDirectoryList: string[] = [];

  for await (const absolutePackageJsonFile of walk({
    directory: path.join(absoluteDirectory, 'node_modules'),
    matches: (pathName): boolean => pathName.endsWith('package.json'),
    ignores (pathName): boolean {
      const pathSegments = pathName.split(path.delimiter);
      const pathSegmentCount = pathSegments.length;

      if (pathSegmentCount < 3) {
        return true;
      }
      if (pathSegments[pathSegmentCount - 3] === 'node_modules') {
        return false;
      }
      if (pathSegments[pathSegmentCount - 3].startsWith('@') && pathSegments[pathSegmentCount - 4] === 'node_modules') {
        return false;
      }

      return true;
    },
    yields: [ EntryType.files ]
  })) {
    const absolutePackageDirectory = path.dirname(absolutePackageJsonFile);
    const packageJsonResult = await getPackageJson({ absoluteDirectory: absolutePackageDirectory });

    if (
      packageJsonResult.hasValue() &&
        packageJsonResult.value.name &&
        packageJsonResult.value.version
    ) {
      absoluteDependencyDirectoryList.push(absolutePackageDirectory);
    }
  }

  return absoluteDependencyDirectoryList;
};

export {
  getAbsoluteDependencyDirectoryList
};
