'use strict';

const shell = require('shelljs');

shell.exec('echo "second file" > second.txt');
shell.exec('git add .');
