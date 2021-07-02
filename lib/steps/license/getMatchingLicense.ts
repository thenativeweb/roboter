import semver from 'semver';

const getMatchingLicense = function ({
  licensesMap,
  packageName,
  packageVersion
}: {
  licensesMap: Partial<Record<string, Partial<Record<string, string>>>>;
  packageName: string;
  packageVersion: string;
}): string | undefined {
  const packageLicenseOverrides = licensesMap[packageName] ?? {};

  for (const [ range, licenseString ] of Object.entries(packageLicenseOverrides)) {
    if (semver.satisfies(packageVersion, range)) {
      return licenseString;
    }
  }
};

export { getMatchingLicense };
