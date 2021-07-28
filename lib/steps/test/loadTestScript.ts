import path from 'path';
import { TestPostScript, TestPreScript } from '../..';

const loadTestScript = async function ({ absolutePotentialScriptFiles }: {
  absolutePotentialScriptFiles: string[];
}): Promise<(() => any) | undefined> {
  for (const absolutePotentialScriptFile of absolutePotentialScriptFiles) {
    try {
      const module = await import(`file://${absolutePotentialScriptFile}`);
      let setupFunction = module.default;

      if (setupFunction.default) {
        setupFunction = setupFunction.default;
      }

      return setupFunction;
    } catch {
      // Ignore potential files that don't exist.
    }
  }

  return undefined;
};

const loadGlobalPreScript = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<TestPreScript | undefined> {
  const absolutePotentialScriptFiles = [
    path.join(applicationRoot, 'test', 'pre.ts'),
    path.join(applicationRoot, 'test', 'pre.js')
  ];

  return loadTestScript({ absolutePotentialScriptFiles });
};

const loadGlobalPostScript = async function ({ applicationRoot }: {
  applicationRoot: string;
}): Promise<TestPostScript | undefined> {
  const absolutePotentialScriptFiles = [
    path.join(applicationRoot, 'test', 'post.ts'),
    path.join(applicationRoot, 'test', 'post.js')
  ];

  return await loadTestScript({ absolutePotentialScriptFiles });
};

const loadTestTypePreScript = async function ({ applicationRoot, testType }: {
  applicationRoot: string;
  testType: string;
}): Promise<TestPreScript | undefined> {
  const absolutePotentialScriptFiles = [
    path.join(applicationRoot, 'test', testType, 'pre.ts'),
    path.join(applicationRoot, 'test', testType, 'pre.js')
  ];

  return loadTestScript({ absolutePotentialScriptFiles });
};

const loadTestTypePostScript = async function ({ applicationRoot, testType }: {
  applicationRoot: string;
  testType: string;
}): Promise<TestPostScript | undefined> {
  const absolutePotentialScriptFiles = [
    path.join(applicationRoot, 'test', testType, 'post.ts'),
    path.join(applicationRoot, 'test', testType, 'post.js')
  ];

  return loadTestScript({ absolutePotentialScriptFiles });
};

export {
  loadGlobalPreScript,
  loadGlobalPostScript,
  loadTestTypePreScript,
  loadTestTypePostScript
};
