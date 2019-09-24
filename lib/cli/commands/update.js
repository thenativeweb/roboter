'use strict';

const gitSteps = require('../../steps/git'),
      globalOptionDefinitions = require('../globalOptionDefinitions'),
      isGitInUpdateableStateTask = require('../tasks/isGitInUpdateableState'),
      ui = require('../ui'),
      updateNodeTask = require('../tasks/updateNode');

const update = {
  description: 'Update a project.',

  async getOptionDefinitions () {
    return [
      {
        name: 'no-push',
        alias: 'p',
        type: Boolean,
        defaultValue: false,
        description: `Don't push updates after commit.`
      },
      {
        name: 'node',
        alias: 'n',
        type: Boolean,
        defaultValue: true,
        description: 'Update Node.js.'
      }
    ];
  },

  async run (options) {
    if (!options) {
      throw new Error('Options are missing.');
    }
    if (options['no-push'] === undefined) {
      throw new Error('No-push is missing.');
    }
    if (options.node === undefined) {
      throw new Error('Node is missing.');
    }

    const directory = process.cwd(),
          { help, 'no-push': noPush, node } = options;

    const push = !noPush;

    if (help) {
      return ui.printUsage([
        { header: 'roboter update', content: this.description },
        { header: 'Synopsis', content: 'roboter update [--no-push] [--node]' },
        { header: 'Options', optionList: [ ...await this.getOptionDefinitions(), ...globalOptionDefinitions ]}
      ]);
    }

    ui.printTaskHeader('update');

    try {
      if (!node) {
        ui.warn('No updates requested, skipping update.');

        return;
      }

      await isGitInUpdateableStateTask({ directory, ui });

      const partsToUpdate = [
        { title: 'Node.js', enabled: node, task: updateNodeTask }
      ];
      let hasAnythingBeenUpdated = false;

      for (const partToUpdate of partsToUpdate) {
        if (!partToUpdate.enabled) {
          continue;
        }

        const { hasBeenUpdated, version } = await partToUpdate.task({ directory, ui });

        if (!hasBeenUpdated) {
          continue;
        }

        ui.printTaskHeader('commit');

        const commitMessage = `Update ${partToUpdate.title} to ${version}.`;

        await gitSteps.commitChanges({ directory, message: commitMessage });

        hasAnythingBeenUpdated = true;
      }

      if (!hasAnythingBeenUpdated) {
        ui.warn('No updates necessary.');

        return;
      }

      if (push) {
        ui.printTaskHeader('get current branch');
        const currentBranch = await gitSteps.getCurrentBranch({ directory });

        ui.printTaskHeader('git push');
        await gitSteps.push({ directory, remote: 'origin', branch: currentBranch, pushTags: false });
      }

      ui.printTaskSuccess(`Successfully updated.`);
    } catch (ex) {
      ui.printTaskFailure('Failed to update.');

      throw ex;
    }
  }
};

module.exports = update;
