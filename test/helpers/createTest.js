'use strict';

const fs = require('fs'),
      path = require('path'),
      { promisify } = require('util');

const assert = require('assertthat'),
      isolated = require('isolated'),
      shell = require('shelljs'),
      stripAnsi = require('strip-ansi'),
      stripIndent = require('common-tags/lib/stripIndent');

const getArgsList = require('./getArgsList'),
      getEnvListAsDockerParameters = require('./getEnvListAsDockerParameters');

const writeFile = promisify(fs.writeFile);

const createTest = function ({ task, testCase, directory }) {
  if (!task) {
    throw new Error('Task is missing.');
  }
  if (!testCase) {
    throw new Error('Test case is missing.');
  }
  if (!directory) {
    throw new Error('Directory is missing.');
  }

  test(`${testCase.replace(/-/ug, ' ')}.`, async () => {
    const tempDirectory = await isolated();

    const imageName = `roboter-test-${task}-${testCase}`;
    const containerName = imageName;

    try {
      shell.cp('-r', [
        `${directory}/*`,
        `${directory}/.*`
      ], tempDirectory);

      shell.rm('-rf', path.join(tempDirectory, 'expected.js'));

      const dockerfileName = path.join(tempDirectory, 'Dockerfile');
      const dockerfileCmd = [
        'npx',
        'roboter',
        task === 'default' ? [] : [ task ],
        getArgsList({ directory: tempDirectory })
      ].flat();

      const dockerfile = stripIndent`
        FROM thenativeweb/roboter-test:latest
        LABEL maintainer="the native web <hello@thenativeweb.io>"

        ADD . /home/node/app

        RUN npm install --no-package-lock --silent

        RUN git init && \
            git add . && \
            git commit -m "Initial commit."

        RUN mkdir /home/node/remote && \
            git init --bare /home/node/remote && \
            git remote add origin /home/node/remote && \
            git push origin master

        RUN if [ -f pre.js ]; then node pre.js; fi

        CMD [ ${dockerfileCmd.map(part => `"${part}"`).join(', ')} ]
      `;

      const gitignoreName = path.join(tempDirectory, '.gitignore');
      const gitignore = stripIndent`
        node_modules
      `;

      await writeFile(dockerfileName, dockerfile, { encoding: 'utf8' });
      await writeFile(gitignoreName, gitignore, { encoding: 'utf8' });

      shell.exec(`docker build -t ${imageName} .`, {
        cwd: tempDirectory
      });

      const docker = shell.exec(`docker run ${getEnvListAsDockerParameters({ directory: tempDirectory })} --name ${containerName} ${imageName}`, {
        cwd: tempDirectory
      });

      const stderr = stripAnsi(docker.stderr),
            stdout = stripAnsi(docker.stdout);

      /* eslint-disable global-require */
      const expected = require(path.join(directory, 'expected.js'));
      /* eslint-enable global-require */

      assert.that(stderr).is.containing(expected.stderr);
      assert.that(docker.code).is.equalTo(expected.exitCode);

      const expectedStdouts = [ expected.stdout ].flat();

      for (const stdoutLine of stdout.split('\n')) {
        if (stdoutLine.includes(expectedStdouts[0])) {
          expectedStdouts.shift();
        }
      }
      if (expectedStdouts.length > 0) {
        throw new Error(`Expected stdout to contain '${expectedStdouts.join('\n')}'.`);
      }

      if (typeof expected.validate !== 'function') {
        return;
      }

      await expected.validate({
        container: containerName,
        directory: tempDirectory,
        exitCode: docker.code,
        stdout,
        stderr
      });
    } finally {
      shell.exec(`docker rm -v ${containerName}`);
    }
  });
};

module.exports = createTest;
