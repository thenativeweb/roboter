interface LicenseCheckConfiguration {
  compatibleLicenses?: string[];
  knownPackageLicenses?: Record<string, Record<string, string>>;
  allowUnsupportedLicenseForThisPackage?: boolean;
  allowDeprecatedLicenseForThisPackage?: boolean;
}

export type {
  LicenseCheckConfiguration
};

