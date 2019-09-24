'use strict';

const gitSteps = require('../../steps/git');

const publishNewGitReleaseTask = async function ({ directory, version, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!version) {
    throw new Error('Version is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('commit');
    await gitSteps.commitChanges({ directory, message: `Release ${version}.` });

    ui.printTaskHeader('git tag');
    await gitSteps.tag({ directory, name: version, message: `Create tag for version ${version}.` });

    ui.printTaskHeader('git push');
    await gitSteps.push({ directory, remote: 'origin', branch: 'master', pushTags: true });
  } catch (ex) {
    ui.printTaskFailure('Failed to create new git release.');
    throw ex;
  }
};

module.exports = publishNewGitReleaseTask;
