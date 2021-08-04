interface LicenseCheckConfiguration {
  compatibleLicenses: string[];
  knownPackageLicenses?: Record<string, Record<string, string>>;
}

export type {
  LicenseCheckConfiguration
};

