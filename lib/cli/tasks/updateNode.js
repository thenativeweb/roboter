'use strict';

const semver = require('semver');

const errors = require('../../errors'),
      findNodeEngineConstraint = require('../../steps/dependencies/findNodeEngineConstraint'),
      findOutdatedNodeVersionReferences = require('../../steps/dependencies/findOutdatedNodeVersionReferences'),
      getLatestNodeLtsVersion = require('../../steps/dependencies/getLatestNodeLtsVersion'),
      setNodeEngineConstraint = require('../../steps/dependencies/setNodeEngineConstraint');

const updateNodeTask = async function ({ directory, ui }) {
  if (!directory) {
    throw new Error('Directory is missing.');
  }
  if (!ui) {
    throw new Error('UI is missing.');
  }

  try {
    ui.printTaskHeader('update Node.js');

    const latestVersion = semver.clean(await getLatestNodeLtsVersion());
    const updatedNodeVersionReferences = [];

    try {
      const nodeEngineConstraint = await findNodeEngineConstraint({ directory });

      if (!semver.satisfies(latestVersion, nodeEngineConstraint)) {
        const newConstraint = `>=${latestVersion} <${semver.inc(latestVersion, 'major')}`;

        await setNodeEngineConstraint({ directory, constraint: newConstraint });

        updatedNodeVersionReferences.push([ nodeEngineConstraint, newConstraint, 'package.json' ]);
      }
    } catch (ex) {
      if (ex.code === 'ENONODEENGINEINPACKAGEJSONFOUND') {
        ui.info('No engines field found in package.json.');
      } else {
        throw ex;
      }
    }

    updatedNodeVersionReferences.push(...await findOutdatedNodeVersionReferences({ directory, replace: true }));

    if (updatedNodeVersionReferences.length > 0) {
      ui.info(`Updated Node.js version(s):`);
      ui.table([[ 'From', 'To', 'Location' ], ...updatedNodeVersionReferences ]);

      return { hasBeenUpdated: true, version: latestVersion };
    }

    ui.printTaskSuccess('Everything up to date.');

    return { hasBeenUpdated: false, version: latestVersion };
  } catch (ex) {
    switch (ex.code) {
      case 'EFILEPARSINGFAILED':
      case 'EDIRECTORYACCESSFAILED':
        ui.info(ex.message);
        throw new errors.DependencyCheckFailed(ex.message);
      default:
        ui.printTaskFailure('Failed to update Node.js.');
        throw ex;
    }
  }
};

module.exports = updateNodeTask;
