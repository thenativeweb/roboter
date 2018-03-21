'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      getUsage = require('command-line-usage');

const analyse = require('./analyse'),
      documentation = require('../../documentation'),
      errors = require('../../errors'),
      files = require('../../files'),
      git = require('../../git'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      pkg = require('../../pkg'),
      test = require('./test');

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

    if (help) {
      return buntstift.info(getUsage([
        { header: 'roboter release', content: this.description },
        { header: 'Synopsis', content: 'roboter release' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]));
    }

    buntstift.line();
    buntstift.info('Releasing new version...', { prefix: '▸' });

    const stopWaiting = buntstift.wait();

    try {
      const packageJsonPath = path.join(directory, 'package.json');
      const hasPackgeJson = await files.exists({ path: packageJsonPath });

      if (!hasPackgeJson) {
        throw new errors.PackageJsonMissing();
      }

      if (!force) {
        await analyse.run({ watch: false });

        await test.run({ watch: false, type: '' });
      }

      await git.checkForPendingChanges({ directory });

      await git.checkIfLocalMasterIsBehindRemote({ directory });

      const readMePath = path.join(directory, 'README.md');
      const hasReadMe = await files.exists({ path: readMePath });

      if (hasReadMe) {
        await documentation.generateTocForMarkdown({ path: readMePath });
      }

      const versions = await pkg.bumpVersion({ path: packageJsonPath, type });

      await git.commitChanges({ directory, message: `Release ${versions.new}.` });

      await git.tag({ directory, name: `v${versions.new}`, message: `Create tag for version ${versions.new}.` });

      await git.push({ directory, remote: 'origin', branch: 'master', pushTags: true });

      stopWaiting();
      buntstift.success('Release successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ELOCALMASTERBEHINDREMOTE':
          buntstift.error('The local master branch is behind origin/master, run git pull first.');
          break;
        case 'EPACKAGEJSONMISSING':
          buntstift.error('No package.json found, run "npm init" to create one.');
          break;
        case 'EPENDINGCHANGES':
          buntstift.error('You have pending changes, commit your changes first.');
          break;
        default:
          buntstift.error('Failed to release.');
      }

      throw ex;
    }
  }
};

module.exports = release;
