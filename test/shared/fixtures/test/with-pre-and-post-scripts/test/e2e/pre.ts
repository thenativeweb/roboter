import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('e2e pre script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    });

    return { foo: 'e2e' };
};

export default pre;
