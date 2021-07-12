import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('global pre script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    });

    console.log('global pre script successful');

    return { foo: 'global' };
};

export default pre;
