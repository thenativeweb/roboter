const foo = function(arg: unknown): void {
    const argIsString = typeof arg === 'string';

    if (argIsString) {
        // Before TypeScript 4.4 this did not recognize `arg` as a string.
        console.log(arg.toUpperCase());
    }
}
