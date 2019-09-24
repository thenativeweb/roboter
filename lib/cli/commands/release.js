'use strict';

const path = require('path');

const analyseTask = require('../tasks/analyse'),
      buildTask = require('../tasks/build'),
      bumpProjectVersionTask = require('../tasks/bumpProjectVersion'),
      checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      dependenciesTask = require('../tasks/dependencies'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      isGitInReleasableStateTask = require('../tasks/isGitInReleasableState'),
      processReadmeForReleaseTask = require('../tasks/processReadmeForRelease'),
      publishNewGitReleaseTask = require('../tasks/publishNewGitRelease'),
      testCodeTask = require('../tasks/testCode'),
      ui = require('../ui');

const release = {
  description: 'Release a new version.',

  async getOptionDefinitions () {
    return [
      {
        name: 'force',
        alias: 'f',
        type: Boolean,
        defaultValue: false,
        description: 'Release without running tests, code analysis etc.'
      },
      {
        name: 'type',
        alias: 't',
        type: String,
        defaultValue: 'patch',
        description: 'patch, minor or major'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (options.force === undefined) {
      throw new Error('Force is missing.');
    }
    if (options.type === undefined) {
      throw new Error('Type is missing.');
    }

    const directory = process.cwd(),
          { help, force, type } = options;

    const packageJsonPath = path.join(directory, 'package.json');

    if (help) {
      return ui.printUsage([
        { header: 'roboter release', content: this.description },
        { header: 'Synopsis', content: 'roboter release [--type <patch|minor|major>] [--force]' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('release');

    try {
      if (!force) {
        await analyseTask({ directory, ui });
        await testCodeTask({ directory, ui });
        await dependenciesTask({ directory, ui });
        await checkLicenseCompatibilityTask({ directory, ui });
      }

      await isGitInReleasableStateTask({ directory, ui });

      const readMePath = path.join(directory, 'README.md');
      const hasReadMe = await files.exists({ path: readMePath });

      if (hasReadMe) {
        await processReadmeForReleaseTask({ path: readMePath, ui });
      }

      await buildTask({ directory, ui });

      const versions = await bumpProjectVersionTask({ path: packageJsonPath, type, ui });

      await publishNewGitReleaseTask({ directory, version: versions.new, ui });

      ui.printTaskSuccess(`Successfully released version ${versions.new}.`);
    } catch (ex) {
      ui.printTaskFailure('Failed to release.');

      throw ex;
    }
  }
};

module.exports = release;
