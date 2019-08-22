'use strict';

const shell = require('shelljs');

shell.mkdir('-p', '/home/node/temp');
shell.exec('git clone /home/node/remote .', { cwd: '/home/node/temp' });
shell.exec('echo "second file" > second.txt', { cwd: '/home/node/temp' });
shell.exec('git add .', { cwd: '/home/node/temp' });
shell.exec('git commit -m "Second commit."', { cwd: '/home/node/temp' });
shell.exec('git push origin master', { cwd: '/home/node/temp' });
