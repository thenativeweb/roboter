'use strict';

const path = require('path');

const documentation = require('../../automation/documentation'),
      files = require('../../files'),
      git = require('../../automation/git'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../automation/pkg'),
      quality = require('../../automation/quality'),
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
    ui.progress.show();

    try {
      if (!force) {
        try {
          await quality.analyseCode({ directory, ui });
        } catch (ex) {
          switch (ex.code) {
            case 'ECODEMALFORMED':
              ui.printTaskFailure('Code analysis failed.');
              break;
            default:
              ui.printTaskFailure('Failed to run code analysis.');
              break;
          }
          throw ex;
        }

        try {
          ui.progress.hide();
          await quality.testCode({ directory, ui });
        } catch (ex) {
          switch (ex.code) {
            case 'ETESTSMISSING':
              ui.warn('No tests found.');
              break;
            case 'ETESTSFAILED':
              ui.printTaskFailure('Tests failed.');
              throw ex;
            default:
              ui.printTaskFailure('Failed to run tests.');
              throw ex;
          }
        }

        try {
          ui.progress.show();
          await pkg.checkForUnusedDependencies({ directory, ui });
        } catch (ex) {
          switch (ex.code) {
            case 'EUNUSEDDEPENDENCIES':
              break;
            default:
              throw ex;
          }
        }

        try {
          ui.progress.hide();
          await pkg.checkForOutdatedDependencies({ directory, ui });
        } catch (ex) {
          switch (ex.code) {
            case 'EOUTDATEDDEPENDENCIES':
              break;
            default:
              throw ex;
          }
        }

        try {
          ui.progress.show();
          await pkg.checkLicenseCompatibility({ directory, ui });
        } catch (ex) {
          switch (ex.code) {
            case 'ELICENSEINCOMPATIBLE':
              throw ex;
            case 'ELICENSENOTSUPPORTED':
              break;
            default:
              throw ex;
          }
        }
      }

      await git.checkForPendingChanges({ directory, ui });
      await git.checkIfLocalMasterIsBehindRemote({ directory, ui });

      const readMePath = path.join(directory, 'README.md');
      const hasReadMe = await files.exists({ path: readMePath });

      if (hasReadMe) {
        await documentation.generateTocForMarkdown({ path: readMePath, ui });
      }

      const sourcePath = path.join(directory, 'src');
      const hasSourceDirectory = await files.exists({ path: sourcePath });

      if (hasSourceDirectory) {
        await pkg.precompile({ directory, sourcePath, distributionPath: path.join(directory, 'dist'), ui });
      }

      const versions = await pkg.bumpVersion({ path: packageJsonPath, type, ui });

      await git.commitChanges({ directory, message: `Release ${versions.new}.`, ui });
      await git.tag({ directory, name: `v${versions.new}`, message: `Create tag for version ${versions.new}.`, ui });
      await git.push({ directory, remote: 'origin', branch: 'master', pushTags: true, ui });

      ui.progress.hide();
      ui.printTaskSuccess('Release successful.');
    } catch (ex) {
      ui.progress.hide();

      switch (ex.code) {
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
