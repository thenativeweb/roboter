'use strict';

const path = require('path');

const analyseTask = require('../tasks/analyse'),
      buildTask = require('../tasks/build'),
      { bumpVersion: bumpVersionStep, generateTocForMarkdown: generateTocForMarkdownStep, git: gitSteps } = require('../../steps/release'),
      checkLicenseCompatibilityTask = require('../tasks/checkLicenseCompatibility'),
      dependenciesTask = require('../tasks/dependencies'),
      files = require('../../files'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
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

      await gitSteps.checkIfOnMaster({ directory, ui });
      await gitSteps.checkForPendingChanges({ directory, ui });
      await gitSteps.checkIfLocalMasterIsBehindRemote({ directory, ui });

      const readMePath = path.join(directory, 'README.md');
      const hasReadMe = await files.exists({ path: readMePath });

      if (hasReadMe) {
        await generateTocForMarkdownStep({ path: readMePath, ui });
      }

      await buildTask({ directory, ui });

      const versions = await bumpVersionStep({ path: packageJsonPath, type, ui });

      await gitSteps.commitChanges({ directory, message: `Release ${versions.new}.`, ui });
      await gitSteps.tag({ directory, name: versions.new, message: `Create tag for version ${versions.new}.`, ui });
      await gitSteps.push({ directory, remote: 'origin', branch: 'master', pushTags: true, ui });

      ui.printTaskSuccess(`Successfully released version ${versions.new}.`);
    } catch (ex) {
      switch (ex.code) {
        case 'ENOTONLOCALMASTER':
          ui.printTaskFailure(`You must be on the 'master' branch, run 'git checkout master' first.`);
          break;
        case 'ELOCALMASTERBEHINDREMOTE':
          ui.printTaskFailure(`The local master branch is behind origin/master, run 'git pull' first.`);
          break;
        case 'EPACKAGEJSONMISSING':
          ui.printTaskFailure(`No package.json found, run 'npm init' to create one.`);
          break;
        case 'EPENDINGCHANGES':
          ui.printTaskFailure('You have pending changes, commit your changes first.');
          break;
        default:
          ui.printTaskFailure('Failed to release.');
      }

      throw ex;
    }
  }
};

module.exports = release;
