'use strict';

const path = require('path');

const buntstift = require('buntstift'),
      fileExists = require('file-exists'),
      getUsage = require('command-line-usage'),
      promisify = require('util.promisify');

const git = require('../../git'),
      globalOptionDefinitions = require('../globalOptionDefinitions');

const exists = promisify(fileExists);

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
          { help, type } = options;

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
      await git.checkForPendingChanges({ directory });

      await git.checkIfLocalMasterIsBehindRemote({ directory });

      stopWaiting();
      buntstift.success('Release successful.');
    } catch (ex) {
      stopWaiting();

      switch (ex.code) {
        case 'ELOCALMASTERBEINDREMOTE':
          buntstift.error('The local master is behind origin/master, run git pull first.');
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
