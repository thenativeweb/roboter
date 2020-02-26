'use strict';

const path = require('path');

const runCommand = require('../../runCommand');

const runPreOrPostTask = async function ({ directory, ui, task, phase }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!phase) {
    throw new Error('Phase is missing.');
  }

  if (phase !== 'pre' && phase !== 'post') {
    throw new Error('Invalid phase.');
  }

  const packageJsonPath = path.join(directory, 'package.json');

  let packageJsonOfModule;

  try {
    // eslint-disable-next-line global-require
    packageJsonOfModule = require(packageJsonPath);
  } catch {
    // Ignore error.
  }

  if (!packageJsonOfModule) {
    return;
  }
  if (!packageJsonOfModule.scripts) {
    return;
  }

  const command = `${phase}${task}`;

  if (!packageJsonOfModule.scripts[command]) {
    return;
  }

  ui.printTaskHeader(`'${phase}${task}'...`);

  await runCommand(`npm run ${command}`, { cwd: directory });

  ui.printTaskSuccess(`Ran '${phase}${task}' successfully.`);
};

module.exports = runPreOrPostTask;
