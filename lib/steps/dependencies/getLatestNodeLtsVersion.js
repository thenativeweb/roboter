'use strict';

const axios = require('axios'),
      semver = require('semver');

const getLatestLtsNodeVersion = async function () {
  const response = await axios.get('http://nodejs.org/dist/index.json');
  const latestLtsDistribution = response.data.find(distribution => distribution.lts !== undefined);

  return semver.clean(latestLtsDistribution.version);
};

module.exports = getLatestLtsNodeVersion;
