const packageLicenses: Partial<Record<string, Partial<Record<string, string>>>> = {
  bitsyntax: {
    // https://github.com/squaremo/bitsyntax-js/commit/1692d9ec2b1bb703c44f10b181d383fa51a21f5d
    '0.0.4': 'MIT'
  },

  coa: {
    // https://github.com/veged/coa/blob/v1.0.4/package.json
    '1.0.4': 'MIT'
  },

  colors: {
    // https://github.com/Marak/colors.js/blob/v0.6.2/MIT-LICENSE.txt
    '0.6.2': 'MIT'
  },

  'config-chain': {
    // https://github.com/dawsbot/config-chain/blob/v1.1.12/LICENCE
    '1.1.12': 'MIT'
  },

  'css-select': {
    // https://github.com/fb55/css-select/blob/v1.2.0/LICENSE
    '1.2.0': 'BSD-2-Clause'
  },

  duplexer2: {
    // https://github.com/deoxxa/duplexer2/blob/0.0.2/LICENSE.md
    '0.0.2': 'BSD-3-Clause'
  },

  entities: {
    // https://github.com/fb55/entities/blob/v1.1.1/LICENSE
    '1.1.1': 'BSD-3-Clause'
  },

  esquery: {
    // https://github.com/estools/esquery/blob/v1.0.0/license.txt
    '1.0.0': 'BSD-3-Clause'
  },

  'fast-xml-parser': {
    // https://github.com/NaturalIntelligence/fast-xml-parser/blob/8d5858b84ddc4122edaea207fb30ef2cead0584c/LICENSE
    // Actually this is not MIT, but it comes close to it, so we handle it like this.
    '3.17.6': 'MIT',
    '3.18.0': 'MIT'
  },

  fileset: {
    // https://github.com/mklabs/node-fileset/blob/v0.2.1/LICENSE-MIT
    '0.2.1': 'MIT'
  },

  'glob-to-regexp': {
    // https://github.com/fitzgen/glob-to-regexp/tree/0.3.0#license
    '0.3.0': 'BSD-2-Clause'
  },

  has: {
    // https://github.com/tarruda/has/blob/1.0.1/package.json
    '1.0.1': 'MIT'
  },

  inherits: {
    // https://github.com/isaacs/inherits/blob/v1.0.1/LICENSE
    // Version 1.0.2 has not been tagged on Github.
    '1.0.2': 'ISC'
  },

  'is-running': {
    // Assumption, related issue is https://github.com/nisaacson/is-running/issues/13
    '2.1.0': 'BSD-3-Clause'
  },

  'json-schema': {
    // https://github.com/kriszyp/json-schema/blob/81ca359daeea643019a4ee81b7a57c06ac53d800/README.md
    '0.2.3': 'BSD-3-Clause'
  },

  nopter: {
    // https://github.com/stevenvachon/nopter/blob/bb0478aa64b6a1a156c28cfc51e94788617d6c0f/package.json
    '0.3.0': 'MIT'
  },

  'regenerator-transform': {
    // https://github.com/facebook/regenerator/blob/85c9e43331576be96e5dcc61757995397ab15b77/LICENSE
    '0.9.11': 'BSD-2-Clause',

    // https://github.com/facebook/regenerator/blob/30d34536b9e3f7a2873b04a16ec66fec9c8246f6/LICENSE
    '0.10.1': 'BSD-2-Clause'
  },

  regjsparser: {
    // https://github.com/jviereck/regjsparser/blob/0.1.5/LICENSE.BSD
    '0.1.5': 'BSD-2-Clause'
  },

  'scss-parser': {
    // https://github.com/salesforce-ux/scss-parser/blob/v1.0.4/LICENSE
    // Actually this is not MIT, but it comes close to it, so we handle it like this.
    '1.0.4': 'MIT'
  },

  semver: {
    // https://github.com/npm/node-semver/blob/v4.3.2/LICENSE
    '4.3.2': 'BSD-2-Clause'
  },

  stackframe: {
    // https://github.com/stacktracejs/stackframe/blob/v1.0.4/package.json
    // Originally unlicensed, but MIT since 1.0.4.
    '0.3.1': 'MIT'
  },

  'unique-stream': {
    // https://github.com/eugeneware/unique-stream/blob/v1.0.0/LICENSE
    '1.0.0': 'MIT'
  }
};

export {
  packageLicenses
};
