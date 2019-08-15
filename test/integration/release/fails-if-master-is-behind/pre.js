'use strict';

const shell = require('shelljs');

shell.exec('echo "second file" > second.txt', { cwd: '/home/node/remote' });
shell.exec('git add .', { cwd: '/home/node/remote' });
shell.exec('git commit -m "Second commit."', { cwd: '/home/node/remote' });
