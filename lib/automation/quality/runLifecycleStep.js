'use strict';

const path = require('path');

const shell = require('shelljs'),
      { stripIndent } = require('common-tags');

const file = require('../../file'),
      files = require('../../files');

const runJsStep = async ({ stepFile }) => {
  if (!stepFile) {
    throw new Error('File is missing.');
  }

  /* eslint-disable global-require */
  const stepFunction = require(stepFile);
  /* eslint-enable global-require */

  if (typeof stepFunction !== 'function') {
    await stepFunction.default();
  } else {
    await stepFunction();
  }
};

const runLifecycleStep = async function ({ directory, step, ui }) {
  if (!directory) {
    throw new Error('Directory is misssing.');
  }
  if (!step) {
    throw new Error('Step is misssing.');
  }
  if (!ui) {
    throw new Error('UI is misssing.');
  }

  const jsStepFile = path.join(directory, `${step}.js`);
  const jsStepExists = await files.exists({ path: jsStepFile });
  const tsStepFile = path.join(directory, `${step}.ts`);
  const tsStepExists = await files.exists({ path: tsStepFile });

  if (!jsStepExists && !tsStepExists) {
    return;
  }

  ui.printTaskHeader(`${step} step`);

  if (jsStepExists) {
    await runJsStep({ stepFile: jsStepFile });
  } else if (tsStepExists) {
    const projectRoot = path.join(directory, '..', '..');

    // The tsConfig is expected in the root of the project, while step files
    // are always expected at /test/<testtype>/<step>, so the tsConfig to extend
    // is two directories upward.
    const temporaryTsConfig = stripIndent`
    {
      "extends": "${path.join(projectRoot, 'tsconfig.json')}",
      "compilerOptions": {
        "declaration": false,
        "outDir": null
      },
      "files": [
        "${tsStepFile}"
      ],
      "include": []
    }
    `;

    const tsConfigPath = path.join(directory, 'tsconfig.json');

    await file.write(tsConfigPath, temporaryTsConfig);

    shell.exec(`tsc`, {
      cwd: directory
    });

    await runJsStep({ stepFile: path.join(directory, `${step}.js`) });
  }
};

module.exports = runLifecycleStep;
