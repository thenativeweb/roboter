import { TestPreScriptParameters } from 'roboter';

const pre = function ({ runNumber, isWatchModeActive, isBailActive, previousRunResult }: TestPreScriptParameters): any {
    console.log('e2e pre script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        previousRunResult
    }));

    return { e2e: true };
};

export default pre;
