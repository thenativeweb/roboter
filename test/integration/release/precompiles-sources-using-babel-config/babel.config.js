'use strict';

module.exports = function (api) {
  api.cache(true);

  const presets = [ '@babel/react' ];

  return {
    presets
  };
};
