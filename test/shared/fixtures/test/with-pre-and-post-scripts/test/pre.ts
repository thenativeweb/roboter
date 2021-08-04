import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('global pre script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    }));

    return { global: true };
};

export default pre;
