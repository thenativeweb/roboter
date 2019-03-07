'use strict';

const whitelistedPackages = {
  'wolkenkit-client': [
    'commands-events',
    'wolkenkit',
    'wolkenkit-eventstore'
  ],
  'wolkenkit-react': [
    'commands-events',
    'wolkenkit',
    'wolkenkit-application',
    'wolkenkit-eventstore'
  ]
};

module.exports = whitelistedPackages;
