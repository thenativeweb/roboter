import { TestPostScriptParameters } from 'roboter';

const post = function ({ runNumber, isWatchModeActive, isBailActive, currentRunResult, preScriptData }: TestPostScriptParameters): void {
    console.log('baz post script', {
        runNumber,
        isWatchModeActive,
        isBailActive,
        currentRunResult,
        preScriptData
    });
};

export default post;
