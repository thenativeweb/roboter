import { TestPostScriptParameters } from 'roboter';

const post = function ({ runNumber, isWatchModeActive, isBailActive, currentRunResult, preScriptData }: TestPostScriptParameters): void {
    console.log('global post script', JSON.stringify({
        runNumber,
        isWatchModeActive,
        isBailActive,
        currentRunResult,
        preScriptData
    }));
};

export default post;
