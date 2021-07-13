import Mocha from 'mocha';

const doesMochaInstanceHaveTests = function ({ mocha }: {
  mocha: Mocha;
}): boolean {
  const suites = [ mocha.suite ];

  while (suites.length > 0) {
    const currentSuite = suites.pop()!;

    suites.push(...currentSuite.suites);

    if (currentSuite.tests.length > 0) {
      return true;
    }
  }

  return false;
};

export {
  doesMochaInstanceHaveTests
};
