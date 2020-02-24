'use strict';

const semver = require('semver');

const checkForOutdatedDependencies = require('../../steps/dependencies/checkForOutdatedDependencies'),
      checkForUnusedDependencies = require('../../steps/dependencies/checkForUnusedDependencies'),
      errors = require('../../errors'),
      findNodeEngineConstraint = require('../../steps/dependencies/findNodeEngineConstraint'),
      findNonStrictDependencies = require('../../steps/dependencies/findNonStrictDependencies'),
      findOutdatedNodeVersionReferences = require('../../steps/dependencies/findOutdatedNodeVersionReferences'),
      getLatestNodeLtsVersion = require('../../steps/dependencies/getLatestNodeLtsVersion'),
      runPreOrPostTask = require('./runPreOrPostTask');

const dependenciesTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'pre' });

    ui.printTaskHeader('dependency check');

    ui.printTaskHeader('unused or missing dependencies check');
    await checkForUnusedDependencies({ directory });

    ui.printTaskHeader('strict dependencies check');
    const nonStrictDependencies = await findNonStrictDependencies({ directory });

    if (nonStrictDependencies.length > 0) {
      ui.warn('Non-strict dependencies found.');
      ui.table(nonStrictDependencies);

      throw new errors.NonStrictDependenciesFound();
    }

    ui.printTaskHeader('outdated dependencies check');
    await checkForOutdatedDependencies({ directory });

    ui.printTaskHeader('outdated Node.js version check');
    const latestVersion = semver.clean(await getLatestNodeLtsVersion());
    const outdatedNodeVersionReferences = [];

    try {
      const nodeEngineConstraint = await findNodeEngineConstraint({ directory });

      if (!semver.satisfies(latestVersion, nodeEngineConstraint)) {
        outdatedNodeVersionReferences.push({
          current: nodeEngineConstraint,
          latest: latestVersion,
          location: 'package.json'
        });
      }
    } catch (ex) {
      if (ex.code === 'ENONODEENGINEINPACKAGEJSONFOUND') {
        ui.info('No engines field found in package.json.');
      } else {
        throw ex;
      }
    }

    outdatedNodeVersionReferences.push(...await findOutdatedNodeVersionReferences({ directory }));

    if (outdatedNodeVersionReferences.length > 0) {
      ui.warn(`Outdated Node.js version(s) found. The latest LTS version is ${latestVersion}.`);
      ui.table(outdatedNodeVersionReferences);

      return;
    }

    ui.printTaskSuccess('Dependency check successful.');

    await runPreOrPostTask({ directory, ui, task: 'deps', phase: 'post' });
  } catch (ex) {
    switch (ex.code) {
      case 'EFILEPARSINGFAILED':
      case 'EDIRECTORYACCESSFAILED':
        ui.info(ex.message);
        throw new errors.DependencyCheckFailed(ex.message);
      case 'EUNUSEDDEPENDENCIES':
        ui.info(ex.message);
        break;
      case 'EOUTDATEDDEPENDENCIES':
        ui.warn('You have outdated dependencies.');
        break;
      default:
        ui.printTaskFailure('Failed to check for unused dependencies.');
        throw ex;
    }
  }
};

module.exports = dependenciesTask;
