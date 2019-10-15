'use strict';

const path = require('path');

const { oneLineInlineLists } = require('common-tags');

const errors = require('../../errors'),
      files = require('../../files'),
      filesToAnalyse = require('../../sourceFiles'),
      runCommand = require('../../runCommand');

const analyseCode = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const sourceFiles = await analyseCode.getFiles({ directory });

  if (sourceFiles.length === 0) {
    throw new errors.NoCodeFound();
  }

  const pathToEslintRc = path.join(directory, '.eslintrc.json');
  const doesEslintRcExist = await files.exists({ path: pathToEslintRc });

  try {
    // We need --quiet to suppress warnings that might get caused by a local
    // .eslintignore file
    await runCommand(oneLineInlineLists`
      npx eslint
        --color
        --quiet
        ${doesEslintRcExist ? '' : `--config ${path.join('node_modules', 'eslint-config-es', 'node.js')}`}
        ${sourceFiles.filter(sourceFile => !sourceFile.startsWith('!')).map(sourceFile => `'${sourceFile}'`)}
        ${sourceFiles.filter(sourceFile => sourceFile.startsWith('!')).map(sourceFile => `--ignore-pattern '${sourceFile}'`)}
    `, { cwd: directory });
  } catch {
    throw new errors.CodeMalformed();
  }
};

analyseCode.getFiles = async function ({ directory }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  const sourceFiles = await files.get({
    directory,
    pattern: filesToAnalyse
  });

  return sourceFiles;
};

module.exports = analyseCode;
