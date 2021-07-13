import Mocha from 'mocha';

const getMochaSuiteTitle = function ({ suite }: {
  suite: Mocha.Suite;
}): string {
  let currentSuite = suite;
  let { title } = suite;

  while (currentSuite.parent) {
    currentSuite = currentSuite.parent;
    title = `${currentSuite.title} ${title}`;
  }

  return title;
};

const pruneMochaInstanceByGrep = function ({ mocha, grep }: {
  mocha: Mocha;
  grep: string;
}): void {
  const regExp = new RegExp(grep, 'u');
  const suites = [ mocha.suite ];

  while (suites.length > 0) {
    const currentSuite = suites.pop()!;

    suites.push(...currentSuite.suites);

    currentSuite.tests = currentSuite.tests.filter((test): boolean => {
      const testTitle = `${getMochaSuiteTitle({ suite: test.parent! })} ${test.title}`;

      return regExp.test(testTitle);
    });
  }
};

export {
  pruneMochaInstanceByGrep
};
