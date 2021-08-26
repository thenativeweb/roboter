## [12.2.2](https://github.com/thenativeweb/roboter/compare/12.2.1...12.2.2) (2021-08-26)


### Bug Fixes

* update eslint-config-es to v3.30.14 ([#704](https://github.com/thenativeweb/roboter/issues/704)) ([b924ec9](https://github.com/thenativeweb/roboter/commit/b924ec9140a675a1870ba55c40bc007fbf454e51))

## [12.2.1](https://github.com/thenativeweb/roboter/compare/12.2.0...12.2.1) (2021-08-25)


### Bug Fixes

* bump mocha from 9.0.3 to 9.1.0 ([#691](https://github.com/thenativeweb/roboter/issues/691)) ([0081063](https://github.com/thenativeweb/roboter/commit/0081063e8319132fb9089a521dbb0a99e8d819a4))

# [12.2.0](https://github.com/thenativeweb/roboter/compare/12.1.3...12.2.0) (2021-08-24)


### Features

* check license against SPDX license list ([#701](https://github.com/thenativeweb/roboter/issues/701)) ([6125043](https://github.com/thenativeweb/roboter/commit/6125043e155f31a3e6dc941dac7aba065294584f))

## [12.1.3](https://github.com/thenativeweb/roboter/compare/12.1.2...12.1.3) (2021-08-24)


### Bug Fixes

* bump eslint-config-es from 3.30.11 to 3.30.13 ([#700](https://github.com/thenativeweb/roboter/issues/700)) ([e13ecb9](https://github.com/thenativeweb/roboter/commit/e13ecb9261993a7f9c077f891663c5d02c8f950d))

## [12.1.2](https://github.com/thenativeweb/roboter/compare/12.1.1...12.1.2) (2021-08-20)


### Bug Fixes

* remove require-engines rule ([#690](https://github.com/thenativeweb/roboter/issues/690)) ([6e0f512](https://github.com/thenativeweb/roboter/commit/6e0f512134f2fbfd246e7fa865d2a652ef09a55d))

## [12.1.1](https://github.com/thenativeweb/roboter/compare/12.1.0...12.1.1) (2021-08-16)


### Bug Fixes

* Always use ANSI colors in output. ([#687](https://github.com/thenativeweb/roboter/issues/687)) ([ee431ea](https://github.com/thenativeweb/roboter/commit/ee431ea8ba873a979b7b0b6618f09516fe2d90b9))

# [12.1.0](https://github.com/thenativeweb/roboter/compare/12.0.0...12.1.0) (2021-08-16)


### Features

* Bump dependencies. ([#685](https://github.com/thenativeweb/roboter/issues/685)) ([33f3fab](https://github.com/thenativeweb/roboter/commit/33f3fab81c7b72d2ee7146edc4295b9f1bf6d535))

# [12.0.0](https://github.com/thenativeweb/roboter/compare/11.7.8...12.0.0) (2021-08-04)


### Features

* TypeScript rewrite; Overhaul feature-set. ([#632](https://github.com/thenativeweb/roboter/issues/632)) ([2d8c768](https://github.com/thenativeweb/roboter/commit/2d8c7686dee10507e0eb681316793c8dfa082c0c))


### BREAKING CHANGES

* - Rename the `analyse` command to `analyze`
- Add package-json linting
- Remove the `update` command
- Remove the feature to run npm scripts via the roboter
- Remove the node version check from the `deps` command
- Redesign license check configuration and behavior to give the responsibility for license compatibility to the project owner(s)
- Redesign the pre/post script running in tests
- Add watch mode for tests
- Add parameter to filter the executed tests
- Add option not to bail after failing tests

Internal things:
- Use Node.js APIs of tools wherever possible (tsc, mocha, eslint, npm-package-json-lint)
- Full typescript rewrite
- Redesign the roboter tests. Now faster and more readable
- Use the roboter to analyse and test itself

## [11.7.8](https://github.com/thenativeweb/roboter/compare/11.7.7...11.7.8) (2021-07-21)


### Bug Fixes

* Add license of scss-parser@1.0.5. ([#660](https://github.com/thenativeweb/roboter/issues/660)) ([feaac7b](https://github.com/thenativeweb/roboter/commit/feaac7bfce335b10a1dfa61af70a321eca924124))

## [11.7.7](https://github.com/thenativeweb/roboter/compare/11.7.6...11.7.7) (2021-06-15)


### Bug Fixes

* bump is-typescript from 4.0.3 to 4.0.5 ([#629](https://github.com/thenativeweb/roboter/issues/629)) ([b31860e](https://github.com/thenativeweb/roboter/commit/b31860e228ddaa846303b00f9a538ddc3e68b697))
* bump processenv from 3.0.5 to 3.0.8 ([#625](https://github.com/thenativeweb/roboter/issues/625)) ([ab1e1d8](https://github.com/thenativeweb/roboter/commit/ab1e1d85fb779736b817625984e4da55c0172dae))

## [11.7.6](https://github.com/thenativeweb/roboter/compare/11.7.5...11.7.6) (2021-06-10)


### Bug Fixes

* bump normalize-url from 5.3.0 to 5.3.1 ([#622](https://github.com/thenativeweb/roboter/issues/622)) ([3119456](https://github.com/thenativeweb/roboter/commit/31194563e50798a4505f0b41196a6b61147c7403))

## [11.7.5](https://github.com/thenativeweb/roboter/compare/11.7.4...11.7.5) (2021-06-08)


### Bug Fixes

* bump glob-parent from 5.1.1 to 5.1.2 ([#621](https://github.com/thenativeweb/roboter/issues/621)) ([ae4cc78](https://github.com/thenativeweb/roboter/commit/ae4cc78134cd5c95956b88c1823200f9d53ed066))

## [11.7.4](https://github.com/thenativeweb/roboter/compare/11.7.3...11.7.4) (2021-06-08)


### Bug Fixes

* bump trim-newlines from 3.0.0 to 3.0.1 ([#620](https://github.com/thenativeweb/roboter/issues/620)) ([09688b4](https://github.com/thenativeweb/roboter/commit/09688b49832775b55f16c9f5fa3de53aeb2920d1))

## [11.7.3](https://github.com/thenativeweb/roboter/compare/11.7.2...11.7.3) (2021-05-31)


### Bug Fixes

* bump buntstift from 4.0.24 to 4.0.25 ([#616](https://github.com/thenativeweb/roboter/issues/616)) ([6fd5291](https://github.com/thenativeweb/roboter/commit/6fd5291885bd737b3cd07541e3e56d767a498485))
* bump typescript from 4.2.4 to 4.3.2 ([#614](https://github.com/thenativeweb/roboter/issues/614)) ([a3c96ee](https://github.com/thenativeweb/roboter/commit/a3c96ee77b43bbb16a6a4520152b761917414eb0))

## [11.7.2](https://github.com/thenativeweb/roboter/compare/11.7.1...11.7.2) (2021-05-31)


### Bug Fixes

* bump defekt from 7.1.2 to 7.2.0 ([#613](https://github.com/thenativeweb/roboter/issues/613)) ([9717655](https://github.com/thenativeweb/roboter/commit/97176550d5f57994af42e21b18e45b51d262ef80))
* bump dotenv from 9.0.2 to 10.0.0 ([#603](https://github.com/thenativeweb/roboter/issues/603)) ([f0e34db](https://github.com/thenativeweb/roboter/commit/f0e34db9ab2d1b6d10ee48b8252744ac1664b938))

## [11.7.1](https://github.com/thenativeweb/roboter/compare/11.7.0...11.7.1) (2021-05-25)


### Bug Fixes

* bump ts-node from 9.1.1 to 10.0.0 ([#608](https://github.com/thenativeweb/roboter/issues/608)) ([debb03f](https://github.com/thenativeweb/roboter/commit/debb03f6f51c07abb57af7cb6a101f22eacf8bc3))

# [11.7.0](https://github.com/thenativeweb/roboter/compare/11.6.50...11.7.0) (2021-05-25)


### Features

* Support mocharc.js to configure test types. ([#611](https://github.com/thenativeweb/roboter/issues/611)) ([f7f367b](https://github.com/thenativeweb/roboter/commit/f7f367bf8965e5080d015373eaee063cf129fa37))

## [11.6.50](https://github.com/thenativeweb/roboter/compare/11.6.49...11.6.50) (2021-05-24)


### Bug Fixes

* bump eslint from 7.26.0 to 7.27.0 ([#604](https://github.com/thenativeweb/roboter/issues/604)) ([8420585](https://github.com/thenativeweb/roboter/commit/8420585ccea4312fad65004c54ee5741dab0b6bc))

## [11.6.49](https://github.com/thenativeweb/roboter/compare/11.6.48...11.6.49) (2021-05-24)


### Bug Fixes

* bump defekt from 7.1.1 to 7.1.2 ([#607](https://github.com/thenativeweb/roboter/issues/607)) ([b92ec83](https://github.com/thenativeweb/roboter/commit/b92ec8381549aeb7a53f531f171a7fb73e328830))

## [11.6.48](https://github.com/thenativeweb/roboter/compare/11.6.47...11.6.48) (2021-05-20)


### Bug Fixes

* use packaged typescript ([#602](https://github.com/thenativeweb/roboter/issues/602)) ([371dd31](https://github.com/thenativeweb/roboter/commit/371dd31b642f01feb4689b633113a971c7cd5497))

## [11.6.47](https://github.com/thenativeweb/roboter/compare/11.6.46...11.6.47) (2021-05-17)


### Bug Fixes

* bump dotenv from 9.0.1 to 9.0.2 ([#597](https://github.com/thenativeweb/roboter/issues/597)) ([6af45e9](https://github.com/thenativeweb/roboter/commit/6af45e92983e6580d7558b33dc0ef6940041715d))

## [11.6.46](https://github.com/thenativeweb/roboter/compare/11.6.45...11.6.46) (2021-05-17)


### Bug Fixes

* bump is-typescript from 4.0.2 to 4.0.3 ([#595](https://github.com/thenativeweb/roboter/issues/595)) ([5dfb712](https://github.com/thenativeweb/roboter/commit/5dfb712597908f92648b9ea565978e514c10e3af))

## [11.6.45](https://github.com/thenativeweb/roboter/compare/11.6.44...11.6.45) (2021-05-17)


### Bug Fixes

* bump defekt from 7.1.0 to 7.1.1 ([#594](https://github.com/thenativeweb/roboter/issues/594)) ([9dadfa0](https://github.com/thenativeweb/roboter/commit/9dadfa0d076a2e9a31fea7be3aeed715ad1e8888))

## [11.6.44](https://github.com/thenativeweb/roboter/compare/11.6.43...11.6.44) (2021-05-17)


### Bug Fixes

* bump depcheck from 1.4.0 to 1.4.1 ([#593](https://github.com/thenativeweb/roboter/issues/593)) ([83a2cba](https://github.com/thenativeweb/roboter/commit/83a2cbacf695e12af4f74c6f0567c0b535ded8e3))

## [11.6.43](https://github.com/thenativeweb/roboter/compare/11.6.42...11.6.43) (2021-05-17)


### Bug Fixes

* bump buntstift from 4.0.23 to 4.0.24 ([#596](https://github.com/thenativeweb/roboter/issues/596)) ([40855af](https://github.com/thenativeweb/roboter/commit/40855afcedcf66116ed72e8b81398ff52a0d59e8))
* bump processenv from 3.0.4 to 3.0.5 ([#599](https://github.com/thenativeweb/roboter/issues/599)) ([a03df34](https://github.com/thenativeweb/roboter/commit/a03df349d2c401e2b7c2ff921072ebe49795e2ac))

## [11.6.42](https://github.com/thenativeweb/roboter/compare/11.6.41...11.6.42) (2021-05-11)


### Bug Fixes

* bump eslint from 7.25.0 to 7.26.0 ([#588](https://github.com/thenativeweb/roboter/issues/588)) ([88b8b75](https://github.com/thenativeweb/roboter/commit/88b8b75096ee625ddb9a7646bb9cfbf2c07fb377))

## [11.6.41](https://github.com/thenativeweb/roboter/compare/11.6.40...11.6.41) (2021-05-10)


### Bug Fixes

* bump hosted-git-info from 2.8.8 to 2.8.9 ([#587](https://github.com/thenativeweb/roboter/issues/587)) ([11c0483](https://github.com/thenativeweb/roboter/commit/11c0483345db51faecf71523e5565614e59dc48e))

## [11.6.40](https://github.com/thenativeweb/roboter/compare/11.6.39...11.6.40) (2021-04-28)


### Bug Fixes

* bump eslint-config-es from 3.28.26 to 3.28.27 ([#572](https://github.com/thenativeweb/roboter/issues/572)) ([ee83c8a](https://github.com/thenativeweb/roboter/commit/ee83c8af364a34c2095b42f30d1b628c99972ad7))

## [11.6.39](https://github.com/thenativeweb/roboter/compare/11.6.38...11.6.39) (2021-04-23)


### Bug Fixes

* bump buntstift from 4.0.22 to 4.0.23 ([#570](https://github.com/thenativeweb/roboter/issues/570)) ([24b19ad](https://github.com/thenativeweb/roboter/commit/24b19ad21efb3aea341b379f8fbe575109b595b9))

## [11.6.38](https://github.com/thenativeweb/roboter/compare/11.6.37...11.6.38) (2021-04-12)


### Bug Fixes

* bump eslint-config-es from 3.28.25 to 3.28.26 ([#567](https://github.com/thenativeweb/roboter/issues/567)) ([232b80d](https://github.com/thenativeweb/roboter/commit/232b80dd0283c818f435bd69b6973b3a1a1da740))

## [11.6.37](https://github.com/thenativeweb/roboter/compare/11.6.36...11.6.37) (2021-03-30)


### Bug Fixes

* bump eslint-config-es from 3.28.24 to 3.28.25 ([#564](https://github.com/thenativeweb/roboter/issues/564)) ([4d44de5](https://github.com/thenativeweb/roboter/commit/4d44de5b571c78de53854e1d9fc1dcdccfa3a646))

## [11.6.36](https://github.com/thenativeweb/roboter/compare/11.6.35...11.6.36) (2021-03-29)


### Bug Fixes

* bump defekt from 7.0.4 to 7.1.0 ([#563](https://github.com/thenativeweb/roboter/issues/563)) ([0eed30d](https://github.com/thenativeweb/roboter/commit/0eed30d9b1746bb7d01fb39b07cceb62fdd4c033))

## [11.6.35](https://github.com/thenativeweb/roboter/compare/11.6.34...11.6.35) (2021-03-27)


### Bug Fixes

* bump eslint from 7.22.0 to 7.23.0 ([#562](https://github.com/thenativeweb/roboter/issues/562)) ([1322a06](https://github.com/thenativeweb/roboter/commit/1322a06e95c11b69785f2f0ccf140b7d48352aff))

## [11.6.34](https://github.com/thenativeweb/roboter/compare/11.6.33...11.6.34) (2021-03-26)


### Bug Fixes

* Update dependencies. ([#561](https://github.com/thenativeweb/roboter/issues/561)) ([c6c6c95](https://github.com/thenativeweb/roboter/commit/c6c6c9555f9a6e45f3b791cd991b28cdd7bafc7f))

## [11.6.33](https://github.com/thenativeweb/roboter/compare/11.6.32...11.6.33) (2021-03-25)


### Bug Fixes

* bump processenv from 3.0.3 to 3.0.4 ([#559](https://github.com/thenativeweb/roboter/issues/559)) ([61c0094](https://github.com/thenativeweb/roboter/commit/61c00941be7ce3dae9415e3e4580132ef5b5c449))

## [11.6.32](https://github.com/thenativeweb/roboter/compare/11.6.31...11.6.32) (2021-03-25)


### Bug Fixes

* update defekt ([#556](https://github.com/thenativeweb/roboter/issues/556)) ([2d3e80c](https://github.com/thenativeweb/roboter/commit/2d3e80c6c17da673eacd3ba17a90441d3627f024))

## [11.6.31](https://github.com/thenativeweb/roboter/compare/11.6.30...11.6.31) (2021-03-25)


### Bug Fixes

* Migrate from master to main. ([#553](https://github.com/thenativeweb/roboter/issues/553)) ([e617082](https://github.com/thenativeweb/roboter/commit/e617082a4a6579ed445b54572ff48c922d511427))

## [11.6.30](https://github.com/thenativeweb/roboter/compare/11.6.29...11.6.30) (2021-03-24)


### Bug Fixes

* bump eslint-config-es from 3.28.21 to 3.28.23 ([#544](https://github.com/thenativeweb/roboter/issues/544)) ([69da195](https://github.com/thenativeweb/roboter/commit/69da19523c2982a9bc31652e79ebb2a6c3fce700))

## [11.6.29](https://github.com/thenativeweb/roboter/compare/11.6.28...11.6.29) (2021-03-23)


### Bug Fixes

* bump eslint-config-es from 3.28.18 to 3.28.21 ([#542](https://github.com/thenativeweb/roboter/issues/542)) ([54f9bc9](https://github.com/thenativeweb/roboter/commit/54f9bc95e954df68b8dab60a98f2bb732f430449))

## [11.6.28](https://github.com/thenativeweb/roboter/compare/11.6.27...11.6.28) (2021-03-23)


### Bug Fixes

* bump semver from 7.3.4 to 7.3.5 ([#541](https://github.com/thenativeweb/roboter/issues/541)) ([9670b36](https://github.com/thenativeweb/roboter/commit/9670b36cbe8ff9a8c0dbb6dffc043ae24594fa8a))

## [11.6.27](https://github.com/thenativeweb/roboter/compare/11.6.26...11.6.27) (2021-03-22)


### Bug Fixes

* bump globby from 11.0.2 to 11.0.3 ([#539](https://github.com/thenativeweb/roboter/issues/539)) ([75c4a26](https://github.com/thenativeweb/roboter/commit/75c4a2639d8624b18a7f984137d2cd79ee318a19))

## [11.6.26](https://github.com/thenativeweb/roboter/compare/11.6.25...11.6.26) (2021-03-22)


### Bug Fixes

* bump @types/mocha from 8.2.1 to 8.2.2 ([#538](https://github.com/thenativeweb/roboter/issues/538)) ([cd307df](https://github.com/thenativeweb/roboter/commit/cd307df9ec538fe7448f688d4a7dc95f95a6b62e))

## [11.6.25](https://github.com/thenativeweb/roboter/compare/11.6.24...11.6.25) (2021-03-10)


### Bug Fixes

* bump eslint-config-es from 3.28.14 to 3.28.16 ([#532](https://github.com/thenativeweb/roboter/issues/532)) ([04f9ea7](https://github.com/thenativeweb/roboter/commit/04f9ea719e7421bc3292fa15af0a0f128fd31a85))

## [11.6.24](https://github.com/thenativeweb/roboter/compare/11.6.23...11.6.24) (2021-03-05)


### Bug Fixes

* bump eslint-config-es from 3.28.13 to 3.28.14 ([#530](https://github.com/thenativeweb/roboter/issues/530)) ([7f37b94](https://github.com/thenativeweb/roboter/commit/7f37b9499db306a5be547d64eeed40e96d74d174))

## [11.6.23](https://github.com/thenativeweb/roboter/compare/11.6.22...11.6.23) (2021-03-02)


### Bug Fixes

* bump eslint-config-es from 3.28.10 to 3.28.13 ([#527](https://github.com/thenativeweb/roboter/issues/527)) ([3407d4e](https://github.com/thenativeweb/roboter/commit/3407d4ea7a8935d4e36e2d5deec654f343eb0fe9))

## [11.6.22](https://github.com/thenativeweb/roboter/compare/11.6.21...11.6.22) (2021-03-02)


### Bug Fixes

* bump buntstift from 4.0.19 to 4.0.20 ([#526](https://github.com/thenativeweb/roboter/issues/526)) ([618a82e](https://github.com/thenativeweb/roboter/commit/618a82e24b45e3808350b293869260ab66e6f2b3))

## [11.6.21](https://github.com/thenativeweb/roboter/compare/11.6.20...11.6.21) (2021-03-02)


### Bug Fixes

* bump typescript from 4.1.5 to 4.2.2 ([#520](https://github.com/thenativeweb/roboter/issues/520)) ([eaab50a](https://github.com/thenativeweb/roboter/commit/eaab50a355ac6834c2e70a715f5a8eef6f19b376))

## [11.6.20](https://github.com/thenativeweb/roboter/compare/11.6.19...11.6.20) (2021-02-23)


### Bug Fixes

* bump eslint-config-es from 3.28.8 to 3.28.10 ([#519](https://github.com/thenativeweb/roboter/issues/519)) ([0aeda8e](https://github.com/thenativeweb/roboter/commit/0aeda8e72aa05dfe43723923e435799ad71e5a62))

## [11.6.19](https://github.com/thenativeweb/roboter/compare/11.6.18...11.6.19) (2021-02-17)


### Bug Fixes

* bump @types/mocha from 8.2.0 to 8.2.1 ([#517](https://github.com/thenativeweb/roboter/issues/517)) ([ba104da](https://github.com/thenativeweb/roboter/commit/ba104da488272ef50938a3b1fc95c32015a89fdc))

## [11.6.18](https://github.com/thenativeweb/roboter/compare/11.6.17...11.6.18) (2021-02-17)


### Bug Fixes

* bump depcheck from 1.3.1 to 1.4.0 ([#516](https://github.com/thenativeweb/roboter/issues/516)) ([c3a1449](https://github.com/thenativeweb/roboter/commit/c3a1449f420e698f170ed29160cf58cecc37367a))

## [11.6.17](https://github.com/thenativeweb/roboter/compare/11.6.16...11.6.17) (2021-02-15)


### Bug Fixes

* bump eslint-config-es from 3.28.5 to 3.28.8 ([#515](https://github.com/thenativeweb/roboter/issues/515)) ([12663d5](https://github.com/thenativeweb/roboter/commit/12663d5c31e258e3bbd65760c70dc19821b6364f))

## [11.6.16](https://github.com/thenativeweb/roboter/compare/11.6.15...11.6.16) (2021-02-15)


### Bug Fixes

* bump eslint from 7.19.0 to 7.20.0 ([#511](https://github.com/thenativeweb/roboter/issues/511)) ([8ba0713](https://github.com/thenativeweb/roboter/commit/8ba07135b6954a449309cbe9ecf39a4d62ce07cd))

## [11.6.15](https://github.com/thenativeweb/roboter/compare/11.6.14...11.6.15) (2021-02-10)


### Bug Fixes

* bump typescript from 4.1.4 to 4.1.5 ([#508](https://github.com/thenativeweb/roboter/issues/508)) ([bb53acf](https://github.com/thenativeweb/roboter/commit/bb53acf97b9364759d8059a030f2a9a4aab19d63))

## [11.6.14](https://github.com/thenativeweb/roboter/compare/11.6.13...11.6.14) (2021-02-10)


### Bug Fixes

* bump eslint-config-es from 3.28.4 to 3.28.5 ([#507](https://github.com/thenativeweb/roboter/issues/507)) ([166e746](https://github.com/thenativeweb/roboter/commit/166e74689adba33791198407463a5b73e33fe1ba))

## [11.6.13](https://github.com/thenativeweb/roboter/compare/11.6.12...11.6.13) (2021-02-09)


### Bug Fixes

* bump typescript from 4.1.3 to 4.1.4 ([#506](https://github.com/thenativeweb/roboter/issues/506)) ([7dfb485](https://github.com/thenativeweb/roboter/commit/7dfb4852a4cb65d0795735c17421237b285a0d7e))

## [11.6.12](https://github.com/thenativeweb/roboter/compare/11.6.11...11.6.12) (2021-02-09)


### Bug Fixes

* bump eslint-config-es from 3.28.2 to 3.28.4 ([#505](https://github.com/thenativeweb/roboter/issues/505)) ([f9eeab7](https://github.com/thenativeweb/roboter/commit/f9eeab7927693826960f7635441469977ae9930f))

## [11.6.11](https://github.com/thenativeweb/roboter/compare/11.6.10...11.6.11) (2021-02-09)


### Bug Fixes

* Update missing license compatibility. ([dfb0121](https://github.com/thenativeweb/roboter/commit/dfb0121ddd426e7c921eb7aa56d19221881a1a44))

## [11.6.10](https://github.com/thenativeweb/roboter/compare/11.6.9...11.6.10) (2021-02-09)


### Bug Fixes

* bump eslint-config-es from 3.28.1 to 3.28.2 ([#504](https://github.com/thenativeweb/roboter/issues/504)) ([838b852](https://github.com/thenativeweb/roboter/commit/838b852470832fa7342a6e10903abb1b17e3526b))

## [11.6.9](https://github.com/thenativeweb/roboter/compare/11.6.8...11.6.9) (2021-02-01)


### Bug Fixes

* bump eslint-config-es from 3.28.0 to 3.28.1 ([#502](https://github.com/thenativeweb/roboter/issues/502)) ([5f34ac5](https://github.com/thenativeweb/roboter/commit/5f34ac5a93c3a810ea932fe1d80fdef2e4ea12cc))

## [11.6.8](https://github.com/thenativeweb/roboter/compare/11.6.7...11.6.8) (2021-02-01)


### Bug Fixes

* bump defekt from 6.0.1 to 6.0.2 ([#495](https://github.com/thenativeweb/roboter/issues/495)) ([f7a9b4e](https://github.com/thenativeweb/roboter/commit/f7a9b4e73caa6b96678ffaf944e9d097f81453ba))

## [11.6.7](https://github.com/thenativeweb/roboter/compare/11.6.6...11.6.7) (2021-02-01)


### Bug Fixes

* bump eslint from 7.18.0 to 7.19.0 ([#501](https://github.com/thenativeweb/roboter/issues/501)) ([4d2425c](https://github.com/thenativeweb/roboter/commit/4d2425cf009bb782760faac59e93cf963a69754a))

## [11.6.6](https://github.com/thenativeweb/roboter/compare/11.6.5...11.6.6) (2021-01-28)


### Bug Fixes

* bump eslint-config-es from 3.27.5 to 3.28.0 ([#500](https://github.com/thenativeweb/roboter/issues/500)) ([28ce1b4](https://github.com/thenativeweb/roboter/commit/28ce1b4775bf52fa87a37fa0d29f4ab2b02410bf))

## [11.6.5](https://github.com/thenativeweb/roboter/compare/11.6.4...11.6.5) (2021-01-27)


### Bug Fixes

* bump buntstift from 4.0.18 to 4.0.19 ([#496](https://github.com/thenativeweb/roboter/issues/496)) ([f681105](https://github.com/thenativeweb/roboter/commit/f6811056ca8fed342ec1683edb73217b291e44c8))

## [11.6.4](https://github.com/thenativeweb/roboter/compare/11.6.3...11.6.4) (2021-01-13)


### Bug Fixes

* bump eslint-config-es from 3.27.4 to 3.27.5 ([#490](https://github.com/thenativeweb/roboter/issues/490)) ([0b92312](https://github.com/thenativeweb/roboter/commit/0b92312f87e7329d7318dc70780e3b1851fb19a5))

## [11.6.3](https://github.com/thenativeweb/roboter/compare/11.6.2...11.6.3) (2021-01-12)


### Bug Fixes

* bump eslint-config-es from 3.27.1 to 3.27.4 ([#489](https://github.com/thenativeweb/roboter/issues/489)) ([b1a7f43](https://github.com/thenativeweb/roboter/commit/b1a7f435573a04b07fdbe3d309a4b1e222e35548))

## [11.6.2](https://github.com/thenativeweb/roboter/compare/11.6.1...11.6.2) (2021-01-07)


### Bug Fixes

* bump eslint-config-es from 3.26.15 to 3.27.1 ([#486](https://github.com/thenativeweb/roboter/issues/486)) ([a98b0ab](https://github.com/thenativeweb/roboter/commit/a98b0ab05f8f40bb19cf23c1b439cfcc158a9542))

## [11.6.1](https://github.com/thenativeweb/roboter/compare/11.6.0...11.6.1) (2021-01-06)


### Bug Fixes

* bump globby from 11.0.1 to 11.0.2 ([#484](https://github.com/thenativeweb/roboter/issues/484)) ([abbd493](https://github.com/thenativeweb/roboter/commit/abbd4931910d8e08898e1d9025ca0f2a91e6a600))

# [11.6.0](https://github.com/thenativeweb/roboter/compare/11.5.30...11.6.0) (2021-01-05)


### Features

* Improve license check. ([#483](https://github.com/thenativeweb/roboter/issues/483)) ([07aec04](https://github.com/thenativeweb/roboter/commit/07aec04d5c1aaf4c4f8659ce6f82074d3cf1b1ae))

## [11.5.30](https://github.com/thenativeweb/roboter/compare/11.5.29...11.5.30) (2021-01-04)


### Bug Fixes

* bump buntstift from 4.0.17 to 4.0.18 ([#480](https://github.com/thenativeweb/roboter/issues/480)) ([2bd0c5d](https://github.com/thenativeweb/roboter/commit/2bd0c5d5e94505ae5ab88b7f089e544a861a87ee))

## [11.5.29](https://github.com/thenativeweb/roboter/compare/11.5.28...11.5.29) (2020-12-28)


### Bug Fixes

* bump axios from 0.21.0 to 0.21.1 ([#475](https://github.com/thenativeweb/roboter/issues/475)) ([6e1980f](https://github.com/thenativeweb/roboter/commit/6e1980f3cf6a85ada1261c4413e471db566d90a9))

## [11.5.28](https://github.com/thenativeweb/roboter/compare/11.5.27...11.5.28) (2020-12-19)


### Bug Fixes

* bump eslint from 7.15.0 to 7.16.0 ([#474](https://github.com/thenativeweb/roboter/issues/474)) ([5316ced](https://github.com/thenativeweb/roboter/commit/5316cedc2074033f6072030341155fd0f1ba4188))

## [11.5.27](https://github.com/thenativeweb/roboter/compare/11.5.26...11.5.27) (2020-12-13)


### Bug Fixes

* bump typescript from 4.1.2 to 4.1.3 ([#472](https://github.com/thenativeweb/roboter/issues/472)) ([7c9d85a](https://github.com/thenativeweb/roboter/commit/7c9d85ad448bf15eb001dfdab892622fc8c22793))

## [11.5.26](https://github.com/thenativeweb/roboter/compare/11.5.25...11.5.26) (2020-12-08)


### Bug Fixes

* bump @types/mocha from 8.0.4 to 8.2.0 ([#470](https://github.com/thenativeweb/roboter/issues/470)) ([405cec2](https://github.com/thenativeweb/roboter/commit/405cec29b3768032b6e58c9cd296380371634265))

## [11.5.25](https://github.com/thenativeweb/roboter/compare/11.5.24...11.5.25) (2020-12-08)


### Bug Fixes

* bump eslint-config-es from 3.26.9 to 3.26.11 ([#469](https://github.com/thenativeweb/roboter/issues/469)) ([bf2b96e](https://github.com/thenativeweb/roboter/commit/bf2b96e9ea89330473bc8823add25924d74e7f5c))

## [11.5.24](https://github.com/thenativeweb/roboter/compare/11.5.23...11.5.24) (2020-12-08)


### Bug Fixes

* bump eslint from 7.14.0 to 7.15.0 ([#466](https://github.com/thenativeweb/roboter/issues/466)) ([c5eb39e](https://github.com/thenativeweb/roboter/commit/c5eb39e5aaa360dd0d95a761f236064961c29e91))

## [11.5.23](https://github.com/thenativeweb/roboter/compare/11.5.22...11.5.23) (2020-12-07)


### Bug Fixes

* bump ts-node from 9.1.0 to 9.1.1 ([#467](https://github.com/thenativeweb/roboter/issues/467)) ([2840214](https://github.com/thenativeweb/roboter/commit/284021431a766fe8c75ce671746e46e12724b73f))

## [11.5.22](https://github.com/thenativeweb/roboter/compare/11.5.21...11.5.22) (2020-12-04)


### Bug Fixes

* Use correct error constructor when non-strict dependencies are found. ([#465](https://github.com/thenativeweb/roboter/issues/465)) ([b6a1a99](https://github.com/thenativeweb/roboter/commit/b6a1a99e2a27e218b909f35b567137e7bfa67adf))

## [11.5.21](https://github.com/thenativeweb/roboter/compare/11.5.20...11.5.21) (2020-12-03)


### Bug Fixes

* bump ts-node from 9.0.0 to 9.1.0 ([#463](https://github.com/thenativeweb/roboter/issues/463)) ([906a75e](https://github.com/thenativeweb/roboter/commit/906a75e68a5434fb3f437ea4bb7d36347f0937fb))

## [11.5.20](https://github.com/thenativeweb/roboter/compare/11.5.19...11.5.20) (2020-12-02)


### Bug Fixes

* bump semver from 7.3.2 to 7.3.4 ([#462](https://github.com/thenativeweb/roboter/issues/462)) ([6634924](https://github.com/thenativeweb/roboter/commit/66349249a48e38dc4d34e5cecc9860de45b9704e))

## [11.5.19](https://github.com/thenativeweb/roboter/compare/11.5.18...11.5.19) (2020-11-30)


### Bug Fixes

* bump eslint-config-es from 3.26.7 to 3.26.9 ([#460](https://github.com/thenativeweb/roboter/issues/460)) ([43cd040](https://github.com/thenativeweb/roboter/commit/43cd0407ae380e4310bba46417519adfdf9bc54e))

## [11.5.18](https://github.com/thenativeweb/roboter/compare/11.5.17...11.5.18) (2020-11-27)


### Bug Fixes

* bump defekt from 6.0.0 to 6.0.1 ([#458](https://github.com/thenativeweb/roboter/issues/458)) ([95d5db6](https://github.com/thenativeweb/roboter/commit/95d5db6e1b7626fc0c53b82342fd26efeda11c1e))

## [11.5.17](https://github.com/thenativeweb/roboter/compare/11.5.16...11.5.17) (2020-11-27)


### Bug Fixes

* bump depcheck from 1.2.0 to 1.3.1 ([#457](https://github.com/thenativeweb/roboter/issues/457)) ([bfba8b8](https://github.com/thenativeweb/roboter/commit/bfba8b844e671b7453d9265c4a387a9538d72503))

## [11.5.16](https://github.com/thenativeweb/roboter/compare/11.5.15...11.5.16) (2020-11-26)


### Bug Fixes

* Add license compatibility for stackframe 0.3.1. ([2d2a7c5](https://github.com/thenativeweb/roboter/commit/2d2a7c5a81ee7e9003b6ed13a885887be57c5708))

## [11.5.15](https://github.com/thenativeweb/roboter/compare/11.5.14...11.5.15) (2020-11-26)


### Bug Fixes

* bump defekt from 5.3.0 to 6.0.0 ([#456](https://github.com/thenativeweb/roboter/issues/456)) ([50b390c](https://github.com/thenativeweb/roboter/commit/50b390ca7b34934dec649aa936fe42748b1ef8cd))

## [11.5.14](https://github.com/thenativeweb/roboter/compare/11.5.13...11.5.14) (2020-11-26)


### Bug Fixes

* bump defekt from 5.2.2 to 5.3.0 ([#455](https://github.com/thenativeweb/roboter/issues/455)) ([e555269](https://github.com/thenativeweb/roboter/commit/e5552694faa7b08aca4a680717bd914ef6b9455e))

## [11.5.13](https://github.com/thenativeweb/roboter/compare/11.5.12...11.5.13) (2020-11-25)


### Bug Fixes

* bump eslint-config-es from 3.26.5 to 3.26.7 ([#454](https://github.com/thenativeweb/roboter/issues/454)) ([68a401f](https://github.com/thenativeweb/roboter/commit/68a401fc7922e13fad234b8b678317666f458b45))

## [11.5.12](https://github.com/thenativeweb/roboter/compare/11.5.11...11.5.12) (2020-11-23)


### Bug Fixes

* bump eslint from 7.13.0 to 7.14.0 ([#451](https://github.com/thenativeweb/roboter/issues/451)) ([9cdecf8](https://github.com/thenativeweb/roboter/commit/9cdecf889713d96db4c373db112ab9c1d3c08d18))

## [11.5.11](https://github.com/thenativeweb/roboter/compare/11.5.10...11.5.11) (2020-11-19)


### Bug Fixes

* bump typescript from 4.0.5 to 4.1.2 ([#449](https://github.com/thenativeweb/roboter/issues/449)) ([0ed0890](https://github.com/thenativeweb/roboter/commit/0ed08902fef9a6cfa2fb1d1d51393bc746b0cfcd))

## [11.5.10](https://github.com/thenativeweb/roboter/compare/11.5.9...11.5.10) (2020-11-17)


### Bug Fixes

* bump eslint-config-es from 3.26.3 to 3.26.5 ([#448](https://github.com/thenativeweb/roboter/issues/448)) ([46ec078](https://github.com/thenativeweb/roboter/commit/46ec0787627db4f737e1244ed07a77d40ba912c4))

## [11.5.9](https://github.com/thenativeweb/roboter/compare/11.5.8...11.5.9) (2020-11-16)


### Bug Fixes

* bump eslint-config-es from 3.26.2 to 3.26.3 ([#444](https://github.com/thenativeweb/roboter/issues/444)) ([e475835](https://github.com/thenativeweb/roboter/commit/e47583520edd55c7dfb16020926e774611309a78))

## [11.5.8](https://github.com/thenativeweb/roboter/compare/11.5.7...11.5.8) (2020-11-11)


### Bug Fixes

* bump @types/mocha from 8.0.3 to 8.0.4 ([#442](https://github.com/thenativeweb/roboter/issues/442)) ([27c8a1d](https://github.com/thenativeweb/roboter/commit/27c8a1d08ec2e2626b6e49a91d4722a55137f056))

## [11.5.7](https://github.com/thenativeweb/roboter/compare/11.5.6...11.5.7) (2020-11-09)


### Bug Fixes

* bump eslint-config-es from 3.26.0 to 3.26.2 ([#440](https://github.com/thenativeweb/roboter/issues/440)) ([79395c1](https://github.com/thenativeweb/roboter/commit/79395c164bd61f22a831b300e9d9143a1dc75bc4))

## [11.5.6](https://github.com/thenativeweb/roboter/compare/11.5.5...11.5.6) (2020-11-09)


### Bug Fixes

* bump eslint from 7.12.1 to 7.13.0 ([#436](https://github.com/thenativeweb/roboter/issues/436)) ([96e45da](https://github.com/thenativeweb/roboter/commit/96e45da5d205712322a4432f483428a2bec4c8fa))

## [11.5.5](https://github.com/thenativeweb/roboter/compare/11.5.4...11.5.5) (2020-11-09)


### Bug Fixes

* bump command-line-usage from 6.1.0 to 6.1.1 ([#437](https://github.com/thenativeweb/roboter/issues/437)) ([3a21810](https://github.com/thenativeweb/roboter/commit/3a21810a9d7044dcc95e5b139535923953752be4))

## [11.5.4](https://github.com/thenativeweb/roboter/compare/11.5.3...11.5.4) (2020-11-04)


### Bug Fixes

* bump eslint-config-es from 3.25.4 to 3.26.0 ([#435](https://github.com/thenativeweb/roboter/issues/435)) ([b93a5b9](https://github.com/thenativeweb/roboter/commit/b93a5b9293cce25a4ebaf01ca039f3d71fc0392f))

## [11.5.3](https://github.com/thenativeweb/roboter/compare/11.5.2...11.5.3) (2020-11-04)


### Bug Fixes

* bump buntstift from 4.0.16 to 4.0.17 ([#432](https://github.com/thenativeweb/roboter/issues/432)) ([f1ecde5](https://github.com/thenativeweb/roboter/commit/f1ecde5dd753d23456a2fcf40b3f530807f881ce))

## [11.5.2](https://github.com/thenativeweb/roboter/compare/11.5.1...11.5.2) (2020-11-03)


### Bug Fixes

* bump is-typescript from 4.0.0 to 4.0.1 ([#428](https://github.com/thenativeweb/roboter/issues/428)) ([91a2bf1](https://github.com/thenativeweb/roboter/commit/91a2bf1ab32a6d4df4c71ab010ac4243b7cc3fc6))
* bump processenv from 3.0.2 to 3.0.3 ([#426](https://github.com/thenativeweb/roboter/issues/426)) ([5974001](https://github.com/thenativeweb/roboter/commit/5974001117a92fbe2d8f69aadff3e6f2e03f5613))

## [11.5.1](https://github.com/thenativeweb/roboter/compare/11.5.0...11.5.1) (2020-11-03)


### Bug Fixes

* bump eslint-config-es from 3.25.1 to 3.25.3 ([#424](https://github.com/thenativeweb/roboter/issues/424)) ([697937b](https://github.com/thenativeweb/roboter/commit/697937b8f2e83b88ce895f130c8134aa5cd1b17d))

# [11.5.0](https://github.com/thenativeweb/roboter/compare/11.4.9...11.5.0) (2020-11-03)


### Features

* Improve license detection. ([#423](https://github.com/thenativeweb/roboter/issues/423)) ([4c75d2f](https://github.com/thenativeweb/roboter/commit/4c75d2f0f5af23502fee724c1168ef1e1c15d43f))

## [11.4.9](https://github.com/thenativeweb/roboter/compare/11.4.8...11.4.9) (2020-11-03)


### Bug Fixes

* bump mocha from 8.2.0 to 8.2.1 ([#421](https://github.com/thenativeweb/roboter/issues/421)) ([5e0bd36](https://github.com/thenativeweb/roboter/commit/5e0bd3664b98574543d41b0119339fabaf2deff6))

## [11.4.8](https://github.com/thenativeweb/roboter/compare/11.4.7...11.4.8) (2020-10-30)


### Bug Fixes

* bump eslint-config-es from 3.25.0 to 3.25.1 ([#419](https://github.com/thenativeweb/roboter/issues/419)) ([9cad5dd](https://github.com/thenativeweb/roboter/commit/9cad5dd5c72b87d5d09608c3afbe02726dd7ac99))

## [11.4.7](https://github.com/thenativeweb/roboter/compare/11.4.6...11.4.7) (2020-10-30)


### Bug Fixes

* bump eslint-config-es from 3.24.9 to 3.25.0 ([#417](https://github.com/thenativeweb/roboter/issues/417)) ([fa1d084](https://github.com/thenativeweb/roboter/commit/fa1d084840b14d4ecac72829d003c0df13326659))

## [11.4.6](https://github.com/thenativeweb/roboter/compare/11.4.5...11.4.6) (2020-10-29)


### Bug Fixes

* bump axios from 0.20.0 to 0.21.0 ([#413](https://github.com/thenativeweb/roboter/issues/413)) ([5caf29b](https://github.com/thenativeweb/roboter/commit/5caf29b19b17165bacda4849c3bbd6d0464b7f75))

## [11.4.5](https://github.com/thenativeweb/roboter/compare/11.4.4...11.4.5) (2020-10-28)


### Bug Fixes

* bump eslint from 7.12.0 to 7.12.1 ([#416](https://github.com/thenativeweb/roboter/issues/416)) ([9796288](https://github.com/thenativeweb/roboter/commit/9796288d919d6bfc0bb6b06cd2a7921fa53f1ce3))

## [11.4.4](https://github.com/thenativeweb/roboter/compare/11.4.3...11.4.4) (2020-10-28)


### Bug Fixes

* bump eslint from 7.11.0 to 7.12.0 ([#414](https://github.com/thenativeweb/roboter/issues/414)) ([3c6f343](https://github.com/thenativeweb/roboter/commit/3c6f343b95dd8143f8de0b5c1db5da517a05f21d))
* bump typescript from 4.0.3 to 4.0.5 ([#415](https://github.com/thenativeweb/roboter/issues/415)) ([c2b1c3c](https://github.com/thenativeweb/roboter/commit/c2b1c3ce66d6bafdccef64e13b6312ee193d9485))

## [11.4.3](https://github.com/thenativeweb/roboter/compare/11.4.2...11.4.3) (2020-10-19)


### Bug Fixes

* bump mocha from 8.1.3 to 8.2.0 ([#407](https://github.com/thenativeweb/roboter/issues/407)) ([ebec56b](https://github.com/thenativeweb/roboter/commit/ebec56beffcde7e59fb9abe0e59c63ede409cb69))

## [11.4.2](https://github.com/thenativeweb/roboter/compare/11.4.1...11.4.2) (2020-10-14)


### Bug Fixes

* bump eslint-config-es from 3.24.2 to 3.24.6 ([#403](https://github.com/thenativeweb/roboter/issues/403)) ([5e24a4a](https://github.com/thenativeweb/roboter/commit/5e24a4a1e6a25df61704d386c6a61492d4e46095))

## [11.4.1](https://github.com/thenativeweb/roboter/compare/11.4.0...11.4.1) (2020-10-14)


### Bug Fixes

* bump defekt from 5.1.0 to 5.2.0 ([#404](https://github.com/thenativeweb/roboter/issues/404)) ([d04dedd](https://github.com/thenativeweb/roboter/commit/d04deddde3d77e4e54bd12c2b61f72e758b285fa))

# [11.4.0](https://github.com/thenativeweb/roboter/compare/11.3.15...11.4.0) (2020-10-12)


### Features

* Run component tests between unit and integration tests. ([#398](https://github.com/thenativeweb/roboter/issues/398)) ([ccd6c40](https://github.com/thenativeweb/roboter/commit/ccd6c40ea03c72e712f252f747e4f792db1a1d89))

## [11.3.15](https://github.com/thenativeweb/roboter/compare/11.3.14...11.3.15) (2020-10-12)


### Bug Fixes

* bump eslint from 7.10.0 to 7.11.0 ([#397](https://github.com/thenativeweb/roboter/issues/397)) ([9f5a803](https://github.com/thenativeweb/roboter/commit/9f5a80388d976f6e928b35f0a12ce359f79e9bb7))

## [11.3.14](https://github.com/thenativeweb/roboter/compare/11.3.13...11.3.14) (2020-10-08)


### Bug Fixes

* bump eslint-config-es from 3.24.1 to 3.24.2 ([#396](https://github.com/thenativeweb/roboter/issues/396)) ([13fb01d](https://github.com/thenativeweb/roboter/commit/13fb01d45749b4b96f91a479f643dc2920e69033))

## [11.3.13](https://github.com/thenativeweb/roboter/compare/11.3.12...11.3.13) (2020-10-07)


### Bug Fixes

* bump eslint-config-es from 3.23.8 to 3.24.1 ([#395](https://github.com/thenativeweb/roboter/issues/395)) ([e6d48b2](https://github.com/thenativeweb/roboter/commit/e6d48b2b54ca14d7f541b390ab1ceab55a723529))

## [11.3.12](https://github.com/thenativeweb/roboter/compare/11.3.11...11.3.12) (2020-10-03)


### Bug Fixes

* bump eslint-config-es from 3.23.7 to 3.23.8 ([#394](https://github.com/thenativeweb/roboter/issues/394)) ([f456844](https://github.com/thenativeweb/roboter/commit/f4568443c529a5d833525033f9ce72cbbd05b9a0))

## [11.3.11](https://github.com/thenativeweb/roboter/compare/11.3.10...11.3.11) (2020-09-29)


### Bug Fixes

* bump eslint-config-es from 3.23.5 to 3.23.7 ([#393](https://github.com/thenativeweb/roboter/issues/393)) ([2ff98b4](https://github.com/thenativeweb/roboter/commit/2ff98b41550ccecbec6e68662acf90cc43f7cf3a))

## [11.3.10](https://github.com/thenativeweb/roboter/compare/11.3.9...11.3.10) (2020-09-28)


### Bug Fixes

* Update dependencies. ([b623284](https://github.com/thenativeweb/roboter/commit/b623284e0db4c51c0eefdfb090043abc1d277080))

## [11.3.9](https://github.com/thenativeweb/roboter/compare/11.3.8...11.3.9) (2020-09-25)


### Bug Fixes

* bump eslint-config-es from 3.23.2 to 3.23.3 ([#390](https://github.com/thenativeweb/roboter/issues/390)) ([2e9cb32](https://github.com/thenativeweb/roboter/commit/2e9cb32ebac56b171add925cd90b8007b8b47bf7))

## [11.3.8](https://github.com/thenativeweb/roboter/compare/11.3.7...11.3.8) (2020-09-24)


### Bug Fixes

* Additional tests were not run if no unit or integration tests existed. ([#389](https://github.com/thenativeweb/roboter/issues/389)) ([f5ce08b](https://github.com/thenativeweb/roboter/commit/f5ce08b198086baf884cfd005ea121a5fff01d49))

## [11.3.7](https://github.com/thenativeweb/roboter/compare/11.3.6...11.3.7) (2020-09-22)


### Bug Fixes

* bump eslint-config-es from 3.21.2 to 3.23.2 ([#388](https://github.com/thenativeweb/roboter/issues/388)) ([08910d6](https://github.com/thenativeweb/roboter/commit/08910d62821b6666a766b09a34bee4d530fb2725))

## [11.3.6](https://github.com/thenativeweb/roboter/compare/11.3.5...11.3.6) (2020-09-19)


### Bug Fixes

* bump typescript from 4.0.2 to 4.0.3 ([#385](https://github.com/thenativeweb/roboter/issues/385)) ([dccc5b2](https://github.com/thenativeweb/roboter/commit/dccc5b2bdf976f6aae5611f3a9731e389e75cc26))

## [11.3.5](https://github.com/thenativeweb/roboter/compare/11.3.4...11.3.5) (2020-09-18)


### Bug Fixes

* Update dependencies. ([f0eadf7](https://github.com/thenativeweb/roboter/commit/f0eadf7f72013813bcee750846bb1f38de00fbae))

## [11.3.4](https://github.com/thenativeweb/roboter/compare/11.3.3...11.3.4) (2020-09-18)


### Bug Fixes

* Update dependencies. ([006cdf1](https://github.com/thenativeweb/roboter/commit/006cdf15702de4f9b2264a9abb7a6d9d972b1ac9))

## [11.3.3](https://github.com/thenativeweb/roboter/compare/11.3.2...11.3.3) (2020-09-18)


### Bug Fixes

* Fix error output. ([#384](https://github.com/thenativeweb/roboter/issues/384)) ([440d927](https://github.com/thenativeweb/roboter/commit/440d927f12ddd6f423331ecf29b009c4eb24c02a))

## [11.3.2](https://github.com/thenativeweb/roboter/compare/11.3.1...11.3.2) (2020-09-18)


### Bug Fixes

* Update ESLint rules. ([43e7fd5](https://github.com/thenativeweb/roboter/commit/43e7fd5af4171077638bd1f6c5bad16004eb6e60))

## [11.3.1](https://github.com/thenativeweb/roboter/compare/11.3.0...11.3.1) (2020-09-16)


### Bug Fixes

* bump eslint-config-es from 3.20.1 to 3.20.3 ([#383](https://github.com/thenativeweb/roboter/issues/383)) ([7298f4e](https://github.com/thenativeweb/roboter/commit/7298f4e0ca5a82a4a2db2cd224bdf1fdb80d4594))

# [11.3.0](https://github.com/thenativeweb/roboter/compare/11.2.28...11.3.0) (2020-09-13)


### Features

* Update to new ESLint rules. ([#381](https://github.com/thenativeweb/roboter/issues/381)) ([d7b277e](https://github.com/thenativeweb/roboter/commit/d7b277e4f8e48f25e7ce655bb627271d978632e5))

## [11.2.28](https://github.com/thenativeweb/roboter/compare/11.2.27...11.2.28) (2020-09-11)


### Bug Fixes

* bump eslint-config-es from 3.19.67 to 3.19.68 ([#379](https://github.com/thenativeweb/roboter/issues/379)) ([7c7f663](https://github.com/thenativeweb/roboter/commit/7c7f6635a8d6b773b29a54e6debc81168133eb41))

## [11.2.27](https://github.com/thenativeweb/roboter/compare/11.2.26...11.2.27) (2020-09-08)


### Bug Fixes

* bump buntstift from 4.0.15 to 4.0.16 ([#378](https://github.com/thenativeweb/roboter/issues/378)) ([5af475e](https://github.com/thenativeweb/roboter/commit/5af475e6d515a71b93fa2b4c01786e242692048b))

## [11.2.26](https://github.com/thenativeweb/roboter/compare/11.2.25...11.2.26) (2020-08-29)


### Bug Fixes

* bump mocha from 8.1.2 to 8.1.3 ([#377](https://github.com/thenativeweb/roboter/issues/377)) ([fc08480](https://github.com/thenativeweb/roboter/commit/fc084803e647e6c00584543428c742acb4df5f57))

## [11.2.25](https://github.com/thenativeweb/roboter/compare/11.2.24...11.2.25) (2020-08-26)


### Bug Fixes

* bump mocha from 8.1.1 to 8.1.2 ([#376](https://github.com/thenativeweb/roboter/issues/376)) ([d768478](https://github.com/thenativeweb/roboter/commit/d76847842ca0570c16660e74fca68ae27d396040))

## [11.2.24](https://github.com/thenativeweb/roboter/compare/11.2.23...11.2.24) (2020-08-23)


### Bug Fixes

* bump axios from 0.19.2 to 0.20.0 ([#373](https://github.com/thenativeweb/roboter/issues/373)) ([4e1d100](https://github.com/thenativeweb/roboter/commit/4e1d100406e313e43d41fb94c1da4e60642dae0b))

## [11.2.23](https://github.com/thenativeweb/roboter/compare/11.2.22...11.2.23) (2020-08-23)


### Bug Fixes

* bump buntstift from 4.0.14 to 4.0.15 ([#375](https://github.com/thenativeweb/roboter/issues/375)) ([6e0f3fc](https://github.com/thenativeweb/roboter/commit/6e0f3fc24f424e33d735a28db9dd2e5894f5be8e))

## [11.2.22](https://github.com/thenativeweb/roboter/compare/11.2.21...11.2.22) (2020-08-23)


### Bug Fixes

* bump ts-node from 8.10.1 to 9.0.0 ([#374](https://github.com/thenativeweb/roboter/issues/374)) ([230284c](https://github.com/thenativeweb/roboter/commit/230284c07b67b61b6a12d3ac52899b78fb030301))

## [11.2.21](https://github.com/thenativeweb/roboter/compare/11.2.20...11.2.21) (2020-08-20)


### Bug Fixes

* bump typescript from 3.9.7 to 4.0.2 ([#372](https://github.com/thenativeweb/roboter/issues/372)) ([a839ae5](https://github.com/thenativeweb/roboter/commit/a839ae55a4f15eb09d312ae1284e5414e5765b4d))

## [11.2.20](https://github.com/thenativeweb/roboter/compare/11.2.19...11.2.20) (2020-08-19)


### Bug Fixes

* bump eslint-config-es from 3.19.65 to 3.19.67 ([#370](https://github.com/thenativeweb/roboter/issues/370)) ([f3b4255](https://github.com/thenativeweb/roboter/commit/f3b4255845a3beb7d0d37cfc53a504b75e7a9407))

## [11.2.19](https://github.com/thenativeweb/roboter/compare/11.2.18...11.2.19) (2020-08-18)


### Bug Fixes

* bump @types/mocha from 8.0.2 to 8.0.3 ([#371](https://github.com/thenativeweb/roboter/issues/371)) ([f694039](https://github.com/thenativeweb/roboter/commit/f694039170610ca0ae35f05d31f06512287cc0ec))

## [11.2.18](https://github.com/thenativeweb/roboter/compare/11.2.17...11.2.18) (2020-08-16)


### Bug Fixes

* bump @types/mocha from 8.0.1 to 8.0.2 ([#368](https://github.com/thenativeweb/roboter/issues/368)) ([95e6a95](https://github.com/thenativeweb/roboter/commit/95e6a959ff64d04962ba4da1f8b91dc42928c691))

## [11.2.17](https://github.com/thenativeweb/roboter/compare/11.2.16...11.2.17) (2020-08-14)


### Bug Fixes

* bump buntstift from 4.0.13 to 4.0.14 ([#367](https://github.com/thenativeweb/roboter/issues/367)) ([78addaf](https://github.com/thenativeweb/roboter/commit/78addafd07263b45777aba5eb566c0c4c0b54e80))

## [11.2.16](https://github.com/thenativeweb/roboter/compare/11.2.15...11.2.16) (2020-08-14)


### Bug Fixes

* bump depcheck from 1.0.0 to 1.2.0 ([#369](https://github.com/thenativeweb/roboter/issues/369)) ([b0a7058](https://github.com/thenativeweb/roboter/commit/b0a70587fd7c0d7b0dc54b92f764a52df76d36a1))

## [11.2.15](https://github.com/thenativeweb/roboter/compare/11.2.14...11.2.15) (2020-08-07)


### Bug Fixes

* bump buntstift from 4.0.12 to 4.0.13 ([#366](https://github.com/thenativeweb/roboter/issues/366)) ([1d69f38](https://github.com/thenativeweb/roboter/commit/1d69f38d34ecd2764f6533f391dffffb03033cee))

## [11.2.14](https://github.com/thenativeweb/roboter/compare/11.2.13...11.2.14) (2020-08-05)


### Bug Fixes

* bump mocha from 8.1.0 to 8.1.1 ([#365](https://github.com/thenativeweb/roboter/issues/365)) ([79fe3a3](https://github.com/thenativeweb/roboter/commit/79fe3a34d7febc2f00c8ea1a21bbec2283f149cb))

## [11.2.13](https://github.com/thenativeweb/roboter/compare/11.2.12...11.2.13) (2020-08-01)


### Bug Fixes

* bump @types/mocha from 8.0.0 to 8.0.1 ([#364](https://github.com/thenativeweb/roboter/issues/364)) ([f65b1ba](https://github.com/thenativeweb/roboter/commit/f65b1ba22e286acf14ded19f21e650ed7e3d00ea))

## [11.2.12](https://github.com/thenativeweb/roboter/compare/11.2.11...11.2.12) (2020-07-31)


### Bug Fixes

* bump mocha from 8.0.1 to 8.1.0 ([#363](https://github.com/thenativeweb/roboter/issues/363)) ([7a7701e](https://github.com/thenativeweb/roboter/commit/7a7701e6675f164dbf9a92c1a042ed1a662015f8))

## [11.2.11](https://github.com/thenativeweb/roboter/compare/11.2.10...11.2.11) (2020-07-27)


### Bug Fixes

* bump eslint-config-es from 3.19.52 to 3.19.65 ([#361](https://github.com/thenativeweb/roboter/issues/361)) ([8a0271c](https://github.com/thenativeweb/roboter/commit/8a0271c03e8c994d1d713924eaab39529c944d8b))

## [11.2.10](https://github.com/thenativeweb/roboter/compare/11.2.9...11.2.10) (2020-07-24)


### Bug Fixes

* bump buntstift from 4.0.11 to 4.0.12 ([#360](https://github.com/thenativeweb/roboter/issues/360)) ([cf19cd8](https://github.com/thenativeweb/roboter/commit/cf19cd810c9528cb49ab41b2511771971f8fa855))

## [11.2.9](https://github.com/thenativeweb/roboter/compare/11.2.8...11.2.9) (2020-07-23)


### Bug Fixes

* bump buntstift from 4.0.10 to 4.0.11 ([#359](https://github.com/thenativeweb/roboter/issues/359)) ([8521049](https://github.com/thenativeweb/roboter/commit/8521049486664b0a06f0443a18936dcf84dfe1db))

## [11.2.8](https://github.com/thenativeweb/roboter/compare/11.2.7...11.2.8) (2020-07-18)


### Bug Fixes

* bump typescript from 3.9.6 to 3.9.7 ([#356](https://github.com/thenativeweb/roboter/issues/356)) ([e70dc28](https://github.com/thenativeweb/roboter/commit/e70dc280e8a6ccf2750c3240089cb748d7fae53c))

## [11.2.7](https://github.com/thenativeweb/roboter/compare/11.2.6...11.2.7) (2020-07-13)


### Bug Fixes

* bump defekt from 5.0.1 to 5.1.0 ([#354](https://github.com/thenativeweb/roboter/issues/354)) ([6996b18](https://github.com/thenativeweb/roboter/commit/6996b188db30720b4e10d80b0ea63b16e8262bcb))

## [11.2.6](https://github.com/thenativeweb/roboter/compare/11.2.5...11.2.6) (2020-07-12)


### Bug Fixes

* bump @types/mocha from 7.0.2 to 8.0.0 ([#353](https://github.com/thenativeweb/roboter/issues/353)) ([810f900](https://github.com/thenativeweb/roboter/commit/810f9005c7792c91c9f371b965dd193c4809d8a3))

## [11.2.5](https://github.com/thenativeweb/roboter/compare/11.2.4...11.2.5) (2020-07-11)


### Bug Fixes

* bump buntstift from 4.0.7 to 4.0.8 ([#352](https://github.com/thenativeweb/roboter/issues/352)) ([369df6b](https://github.com/thenativeweb/roboter/commit/369df6b6d599e483d9301361176959ba34aa15f4))

## [11.2.4](https://github.com/thenativeweb/roboter/compare/11.2.3...11.2.4) (2020-07-06)


### Bug Fixes

* bump depcheck from 0.9.2 to 1.0.0 ([#351](https://github.com/thenativeweb/roboter/issues/351)) ([d27a40d](https://github.com/thenativeweb/roboter/commit/d27a40d35b8c48feb9c34e4a5e16117f802c6c19))

## [11.2.3](https://github.com/thenativeweb/roboter/compare/11.2.2...11.2.3) (2020-07-02)


### Bug Fixes

* bump buntstift from 4.0.3 to 4.0.7 ([#350](https://github.com/thenativeweb/roboter/issues/350)) ([32fc649](https://github.com/thenativeweb/roboter/commit/32fc649eddeee68c10c25f97cfd5c05e529121c5))

## [11.2.2](https://github.com/thenativeweb/roboter/compare/11.2.1...11.2.2) (2020-07-02)


### Bug Fixes

* bump typescript from 3.9.3 to 3.9.6 ([#349](https://github.com/thenativeweb/roboter/issues/349)) ([e5d2081](https://github.com/thenativeweb/roboter/commit/e5d2081afc1a50abde950bcc26dad014d98ca223))

## [11.2.1](https://github.com/thenativeweb/roboter/compare/11.2.0...11.2.1) (2020-06-12)


### Bug Fixes

* bump mocha from 7.2.0 to 8.0.1 ([#344](https://github.com/thenativeweb/roboter/issues/344)) ([88e172d](https://github.com/thenativeweb/roboter/commit/88e172dcd1fcb05abc9bd43f42530a86b872b767))

# [11.2.0](https://github.com/thenativeweb/roboter/compare/11.1.26...11.2.0) (2020-06-10)


### Features

* Add other writing style for Apache 2.0 license. ([d7f3fbe](https://github.com/thenativeweb/roboter/commit/d7f3fbef8caf7f8399f2471b19be13cf6f4fc28e))

## [11.1.26](https://github.com/thenativeweb/roboter/compare/11.1.25...11.1.26) (2020-05-25)


### Bug Fixes

* bump mocha from 7.1.2 to 7.2.0 ([#337](https://github.com/thenativeweb/roboter/issues/337)) ([c7ab36d](https://github.com/thenativeweb/roboter/commit/c7ab36df595a15c110bbb8898af0672ed97561b6))

## [11.1.25](https://github.com/thenativeweb/roboter/compare/11.1.24...11.1.25) (2020-05-21)


### Bug Fixes

* bump typescript from 3.9.2 to 3.9.3 ([#336](https://github.com/thenativeweb/roboter/issues/336)) ([5abcd07](https://github.com/thenativeweb/roboter/commit/5abcd07209ec9637ebf8e97a38db8cbc1459cbe9))

## [11.1.24](https://github.com/thenativeweb/roboter/compare/11.1.23...11.1.24) (2020-05-13)


### Bug Fixes

* bump typescript from 3.8.3 to 3.9.2 ([#333](https://github.com/thenativeweb/roboter/issues/333)) ([a8df430](https://github.com/thenativeweb/roboter/commit/a8df4308411b8749d447950c1794681781532bfa))

## [11.1.23](https://github.com/thenativeweb/roboter/compare/11.1.22...11.1.23) (2020-05-04)


### Bug Fixes

* bump ts-node from 8.9.1 to 8.10.1 ([#330](https://github.com/thenativeweb/roboter/issues/330)) ([72a2f6d](https://github.com/thenativeweb/roboter/commit/72a2f6d93431874e5115b5be85ea7b6772197535))

## [11.1.22](https://github.com/thenativeweb/roboter/compare/11.1.21...11.1.22) (2020-04-30)


### Bug Fixes

* bump processenv from 3.0.1 to 3.0.2 ([#328](https://github.com/thenativeweb/roboter/issues/328)) ([dce8a72](https://github.com/thenativeweb/roboter/commit/dce8a72aecb19a5b3e37117d97da2e6e10637193))

## [11.1.21](https://github.com/thenativeweb/roboter/compare/11.1.20...11.1.21) (2020-04-27)


### Bug Fixes

* bump ts-node from 8.8.1 to 8.9.1 ([#325](https://github.com/thenativeweb/roboter/issues/325)) ([a7fbc1d](https://github.com/thenativeweb/roboter/commit/a7fbc1dd985de17ddbb1312a9b451c19761ff3e8))

## [11.1.20](https://github.com/thenativeweb/roboter/compare/11.1.19...11.1.20) (2020-04-27)


### Bug Fixes

* bump mocha from 7.1.1 to 7.1.2 ([#326](https://github.com/thenativeweb/roboter/issues/326)) ([253b37c](https://github.com/thenativeweb/roboter/commit/253b37cbef20b1737bc96f42d22988bb8f1d5b9b))

## [11.1.19](https://github.com/thenativeweb/roboter/compare/11.1.18...11.1.19) (2020-04-25)


### Bug Fixes

* bump shelljs from 0.8.3 to 0.8.4 ([#324](https://github.com/thenativeweb/roboter/issues/324)) ([0c973a5](https://github.com/thenativeweb/roboter/commit/0c973a5ad688c8ba2bb6ac1f3762a9bd8991d264))

## [11.1.18](https://github.com/thenativeweb/roboter/compare/11.1.17...11.1.18) (2020-04-24)


### Bug Fixes

* Fix typo. ([#320](https://github.com/thenativeweb/roboter/issues/320)) ([b677dde](https://github.com/thenativeweb/roboter/commit/b677dde69b1b68b68a7eaebd8410623f2eb55179))

## [11.1.17](https://github.com/thenativeweb/roboter/compare/11.1.16...11.1.17) (2020-03-30)


### Bug Fixes

* bump eslint-config-es from 3.19.50 to 3.19.52 ([#309](https://github.com/thenativeweb/roboter/issues/309)) ([08a8835](https://github.com/thenativeweb/roboter/commit/08a8835172240513647c5dd1c9b61220266c9d50))

## [11.1.16](https://github.com/thenativeweb/roboter/compare/11.1.15...11.1.16) (2020-03-25)


### Bug Fixes

* bump eslint-config-es from 3.19.48 to 3.19.50 ([#307](https://github.com/thenativeweb/roboter/issues/307)) ([98a52e6](https://github.com/thenativeweb/roboter/commit/98a52e6515c0590da07c7325af754bdffbf3cd8b))

## [11.1.15](https://github.com/thenativeweb/roboter/compare/11.1.14...11.1.15) (2020-03-22)


### Bug Fixes

* bump ts-node from 8.7.0 to 8.8.1 ([#305](https://github.com/thenativeweb/roboter/issues/305)) ([f7bb749](https://github.com/thenativeweb/roboter/commit/f7bb749981e62a0c0f3508e266574654a45ac8e3))

## [11.1.14](https://github.com/thenativeweb/roboter/compare/11.1.13...11.1.14) (2020-03-19)


### Bug Fixes

* bump ts-node from 8.6.2 to 8.7.0 ([#300](https://github.com/thenativeweb/roboter/issues/300)) ([e3f4ef1](https://github.com/thenativeweb/roboter/commit/e3f4ef1ff0a8062d11b3f089494744179be4b7ae))

## [11.1.13](https://github.com/thenativeweb/roboter/compare/11.1.12...11.1.13) (2020-03-18)


### Bug Fixes

* Improve license check. ([#299](https://github.com/thenativeweb/roboter/issues/299)) ([58c24cb](https://github.com/thenativeweb/roboter/commit/58c24cbbb669c27c6f98333068754ee58da18e48))

## [11.1.12](https://github.com/thenativeweb/roboter/compare/11.1.11...11.1.12) (2020-03-18)


### Bug Fixes

* bump mocha from 7.1.0 to 7.1.1 ([#298](https://github.com/thenativeweb/roboter/issues/298)) ([45a9542](https://github.com/thenativeweb/roboter/commit/45a95425a4c619b16cd7b98b66b8aa32b4465fd5))

## [11.1.11](https://github.com/thenativeweb/roboter/compare/11.1.10...11.1.11) (2020-03-17)


### Bug Fixes

* bump eslint-config-es from 3.19.46 to 3.19.48 ([#297](https://github.com/thenativeweb/roboter/issues/297)) ([3cc574b](https://github.com/thenativeweb/roboter/commit/3cc574b5fd8c5b56ddf0bad1d2e33c08de6b5aea))

## [11.1.10](https://github.com/thenativeweb/roboter/compare/11.1.9...11.1.10) (2020-03-16)


### Bug Fixes

* bump eslint-config-es from 3.19.45 to 3.19.46 ([#295](https://github.com/thenativeweb/roboter/issues/295)) ([dc6bc1f](https://github.com/thenativeweb/roboter/commit/dc6bc1fc735653f635233deb34c09a79cbba6053))

## [11.1.9](https://github.com/thenativeweb/roboter/compare/11.1.8...11.1.9) (2020-03-15)


### Bug Fixes

* bump eslint-config-es from 3.19.40 to 3.19.45 ([#294](https://github.com/thenativeweb/roboter/issues/294)) ([98cd9db](https://github.com/thenativeweb/roboter/commit/98cd9db43776d3b7e57c6480c3d5c6fe4fb40b33))

## [11.1.8](https://github.com/thenativeweb/roboter/compare/11.1.7...11.1.8) (2020-03-10)


### Bug Fixes

* bump buntstift from 4.0.2 to 4.0.3 ([#292](https://github.com/thenativeweb/roboter/issues/292)) ([c931984](https://github.com/thenativeweb/roboter/commit/c931984c1256e8c6254e32f411354000d482280b))

## [11.1.7](https://github.com/thenativeweb/roboter/compare/11.1.6...11.1.7) (2020-03-08)


### Bug Fixes

* bump eslint-config-es from 3.19.39 to 3.19.40 ([#288](https://github.com/thenativeweb/roboter/issues/288)) ([93ba4c1](https://github.com/thenativeweb/roboter/commit/93ba4c150c68b6d05aa70aed85066fdbf75ecf9d))

## [11.1.6](https://github.com/thenativeweb/roboter/compare/11.1.5...11.1.6) (2020-03-07)


### Bug Fixes

* bump eslint-config-es from 3.19.38 to 3.19.39 ([#287](https://github.com/thenativeweb/roboter/issues/287)) ([697fc7c](https://github.com/thenativeweb/roboter/commit/697fc7c0b333eaeaa4b5d4756ef19a6e896694bc))

## [11.1.5](https://github.com/thenativeweb/roboter/compare/11.1.4...11.1.5) (2020-03-04)


### Bug Fixes

* bump buntstift from 4.0.1 to 4.0.2 ([#285](https://github.com/thenativeweb/roboter/issues/285)) ([f76bfac](https://github.com/thenativeweb/roboter/commit/f76bfac6e3b45489c7bfc84764a8125097fe7d86))

## [11.1.4](https://github.com/thenativeweb/roboter/compare/11.1.3...11.1.4) (2020-03-04)


### Bug Fixes

* bump eslint-config-es from 3.19.36 to 3.19.38 ([#284](https://github.com/thenativeweb/roboter/issues/284)) ([1c1d11f](https://github.com/thenativeweb/roboter/commit/1c1d11f7d8e663075c2723683a25023429a204c7))

## [11.1.3](https://github.com/thenativeweb/roboter/compare/11.1.2...11.1.3) (2020-03-04)


### Bug Fixes

* bump @types/mocha from 7.0.1 to 7.0.2 ([#283](https://github.com/thenativeweb/roboter/issues/283)) ([4f53497](https://github.com/thenativeweb/roboter/commit/4f534972f4233b961c928e9f5282a89901ed49ab))

## [11.1.2](https://github.com/thenativeweb/roboter/compare/11.1.1...11.1.2) (2020-02-29)


### Bug Fixes

* bump buntstift from 4.0.0 to 4.0.1 ([#281](https://github.com/thenativeweb/roboter/issues/281)) ([008df8d](https://github.com/thenativeweb/roboter/commit/008df8d1b97521334cd46a765d77985eb4be5a77))

## [11.1.1](https://github.com/thenativeweb/roboter/compare/11.1.0...11.1.1) (2020-02-29)


### Bug Fixes

* bump typescript from 3.8.2 to 3.8.3 ([#280](https://github.com/thenativeweb/roboter/issues/280)) ([7d0ff4f](https://github.com/thenativeweb/roboter/commit/7d0ff4f2ff069d78d64e3a2670bbf021b4c66296))

# [11.1.0](https://github.com/thenativeweb/roboter/compare/11.0.25...11.1.0) (2020-02-26)


### Features

* Add pre and post tasks. ([#277](https://github.com/thenativeweb/roboter/issues/277)) ([fee3556](https://github.com/thenativeweb/roboter/commit/fee3556a5b09123be2614ae7bc07ba6c7b890a06))

## [11.0.25](https://github.com/thenativeweb/roboter/compare/11.0.24...11.0.25) (2020-02-26)


### Bug Fixes

* bump mocha from 7.0.1 to 7.1.0 ([#278](https://github.com/thenativeweb/roboter/issues/278)) ([49c250b](https://github.com/thenativeweb/roboter/commit/49c250b7cf2a40273f2d1ed2a40a7dc4326f185b))

## [11.0.24](https://github.com/thenativeweb/roboter/compare/11.0.23...11.0.24) (2020-02-24)


### Bug Fixes

* bump eslint-config-es from 3.19.34 to 3.19.36 ([#276](https://github.com/thenativeweb/roboter/issues/276)) ([dc5f1aa](https://github.com/thenativeweb/roboter/commit/dc5f1aa68b459965cabd152499c9c1e123f3c6c1))

## [11.0.23](https://github.com/thenativeweb/roboter/compare/11.0.22...11.0.23) (2020-02-20)


### Bug Fixes

* bump typescript from 3.7.5 to 3.8.2 ([#274](https://github.com/thenativeweb/roboter/issues/274)) ([68b95cf](https://github.com/thenativeweb/roboter/commit/68b95cfc0ff0766cd1064cabe25150ed89233b20))

## [11.0.22](https://github.com/thenativeweb/roboter/compare/11.0.21...11.0.22) (2020-02-19)


### Bug Fixes

* bump eslint-config-es from 3.19.33 to 3.19.34 ([#273](https://github.com/thenativeweb/roboter/issues/273)) ([a67b2f9](https://github.com/thenativeweb/roboter/commit/a67b2f938dabf7eb66aa3f849c8fbd413cc3863a))

## [11.0.21](https://github.com/thenativeweb/roboter/compare/11.0.20...11.0.21) (2020-02-17)


### Bug Fixes

* bump eslint-config-es from 3.19.31 to 3.19.33 ([#271](https://github.com/thenativeweb/roboter/issues/271)) ([61834ca](https://github.com/thenativeweb/roboter/commit/61834ca40acc346ef1e4f864c9912d2f0480b91e))

## [11.0.20](https://github.com/thenativeweb/roboter/compare/11.0.19...11.0.20) (2020-02-12)


### Bug Fixes

* bump eslint-config-es from 3.19.30 to 3.19.31 ([#269](https://github.com/thenativeweb/roboter/issues/269)) ([8d6d30b](https://github.com/thenativeweb/roboter/commit/8d6d30b1e79dff36830bf6880111cd1e000fd16c))

## [11.0.19](https://github.com/thenativeweb/roboter/compare/11.0.18...11.0.19) (2020-02-12)


### Bug Fixes

* bump semver from 7.1.2 to 7.1.3 ([#268](https://github.com/thenativeweb/roboter/issues/268)) ([3e9a44a](https://github.com/thenativeweb/roboter/commit/3e9a44aaa47565c63e38e841dbed7a6863a95ee8))

## [11.0.18](https://github.com/thenativeweb/roboter/compare/11.0.17...11.0.18) (2020-02-11)


### Bug Fixes

* bump buntstift from 3.1.0 to 4.0.0 ([#261](https://github.com/thenativeweb/roboter/issues/261)) ([23e8cf0](https://github.com/thenativeweb/roboter/commit/23e8cf001d7d051ca16a0d2ad898b053c60b14bc))

## [11.0.17](https://github.com/thenativeweb/roboter/compare/11.0.16...11.0.17) (2020-02-11)


### Bug Fixes

* bump eslint-config-es from 3.19.29 to 3.19.30 ([#267](https://github.com/thenativeweb/roboter/issues/267)) ([57f224c](https://github.com/thenativeweb/roboter/commit/57f224ca60e083dc66dc8cb560b4793963ceb7a4))

## [11.0.16](https://github.com/thenativeweb/roboter/compare/11.0.15...11.0.16) (2020-02-11)


### Bug Fixes

* bump eslint-config-es from 3.19.25 to 3.19.29 ([#266](https://github.com/thenativeweb/roboter/issues/266)) ([b62e41e](https://github.com/thenativeweb/roboter/commit/b62e41e11c6f36abfb8471353c78bdf334d23f9d))

## [11.0.15](https://github.com/thenativeweb/roboter/compare/11.0.14...11.0.15) (2020-02-04)


### Bug Fixes

* bump eslint-config-es from 3.19.24 to 3.19.25 ([#260](https://github.com/thenativeweb/roboter/issues/260)) ([c6f0250](https://github.com/thenativeweb/roboter/commit/c6f0250e796da875fa5bacccc945aead163e989e))

## [11.0.14](https://github.com/thenativeweb/roboter/compare/11.0.13...11.0.14) (2020-02-04)


### Bug Fixes

* bump eslint-config-es from 3.19.23 to 3.19.24 ([#259](https://github.com/thenativeweb/roboter/issues/259)) ([76ba5ee](https://github.com/thenativeweb/roboter/commit/76ba5eeceaa5e321037777abede87eda3ea9e5a8))

## [11.0.13](https://github.com/thenativeweb/roboter/compare/11.0.12...11.0.13) (2020-02-03)


### Bug Fixes

* bump defekt from 5.0.0 to 5.0.1 ([#258](https://github.com/thenativeweb/roboter/issues/258)) ([c2bb1bf](https://github.com/thenativeweb/roboter/commit/c2bb1bf19f1e4d0012867a7b93f1503fc829fd5b))

## [11.0.12](https://github.com/thenativeweb/roboter/compare/11.0.11...11.0.12) (2020-02-03)


### Bug Fixes

* bump eslint-config-es from 3.19.20 to 3.19.23 ([#257](https://github.com/thenativeweb/roboter/issues/257)) ([95008d2](https://github.com/thenativeweb/roboter/commit/95008d2d98f9a663abca153431fb7ea029eb1de8))

## [11.0.11](https://github.com/thenativeweb/roboter/compare/11.0.10...11.0.11) (2020-01-31)


### Bug Fixes

* bump semver from 7.1.1 to 7.1.2 ([#253](https://github.com/thenativeweb/roboter/issues/253)) ([0e2379b](https://github.com/thenativeweb/roboter/commit/0e2379b762a4ad5a46f7f93b273ea3adcc27270c))

## [11.0.10](https://github.com/thenativeweb/roboter/compare/11.0.9...11.0.10) (2020-01-30)


### Bug Fixes

* bump depcheck from 0.9.1 to 0.9.2 ([#252](https://github.com/thenativeweb/roboter/issues/252)) ([9a6dd4b](https://github.com/thenativeweb/roboter/commit/9a6dd4b28837be48fcbd57fdb91354203ec8c8ac))

## [11.0.9](https://github.com/thenativeweb/roboter/compare/11.0.8...11.0.9) (2020-01-30)


### Bug Fixes

* bump @types/mocha from 5.2.7 to 7.0.1 ([#251](https://github.com/thenativeweb/roboter/issues/251)) ([94bce30](https://github.com/thenativeweb/roboter/commit/94bce305621e9792a02cb4144e899b5ccc421f20))

## [11.0.8](https://github.com/thenativeweb/roboter/compare/11.0.7...11.0.8) (2020-01-28)


### Bug Fixes

* bump eslint-config-es from 3.19.19 to 3.19.20 ([#248](https://github.com/thenativeweb/roboter/issues/248)) ([b865f65](https://github.com/thenativeweb/roboter/commit/b865f6572d8c34f454a0f1101a52363c5d73c817))

## [11.0.7](https://github.com/thenativeweb/roboter/compare/11.0.6...11.0.7) (2020-01-28)


### Bug Fixes

* bump eslint-config-es from 3.19.18 to 3.19.19 ([#245](https://github.com/thenativeweb/roboter/issues/245)) ([c35b1cb](https://github.com/thenativeweb/roboter/commit/c35b1cba87fd84f92c592aafb57ddd48f884f860))

## [11.0.6](https://github.com/thenativeweb/roboter/compare/11.0.5...11.0.6) (2020-01-27)


### Bug Fixes

* bump buntstift from 3.0.4 to 3.1.0 ([#243](https://github.com/thenativeweb/roboter/issues/243)) ([dc38c17](https://github.com/thenativeweb/roboter/commit/dc38c173003312067a1228c93697bf7c9b38cd44))

## [11.0.5](https://github.com/thenativeweb/roboter/compare/11.0.4...11.0.5) (2020-01-26)


### Bug Fixes

* bump mocha from 7.0.0 to 7.0.1 ([#242](https://github.com/thenativeweb/roboter/issues/242)) ([c1c683b](https://github.com/thenativeweb/roboter/commit/c1c683ba270f141d282e94cfba53e9045a2f555b))

## [11.0.4](https://github.com/thenativeweb/roboter/compare/11.0.3...11.0.4) (2020-01-25)


### Bug Fixes

* bump buntstift from 3.0.3 to 3.0.4 ([#241](https://github.com/thenativeweb/roboter/issues/241)) ([f418ff3](https://github.com/thenativeweb/roboter/commit/f418ff3bbd0d1fa06dde6d40dc599226e3bda2a7))

## [11.0.3](https://github.com/thenativeweb/roboter/compare/11.0.2...11.0.3) (2020-01-22)


### Bug Fixes

* bump axios from 0.19.1 to 0.19.2 ([#239](https://github.com/thenativeweb/roboter/issues/239)) ([18971ac](https://github.com/thenativeweb/roboter/commit/18971aca0f082e9f460b40285e8786972fc289e2))

## [11.0.2](https://github.com/thenativeweb/roboter/compare/11.0.1...11.0.2) (2020-01-21)


### Bug Fixes

* bump eslint-config-es from 3.19.17 to 3.19.18 ([#238](https://github.com/thenativeweb/roboter/issues/238)) ([a4111c4](https://github.com/thenativeweb/roboter/commit/a4111c471151f6844472d9bf8df1612282ded05e))

## [11.0.1](https://github.com/thenativeweb/roboter/compare/11.0.0...11.0.1) (2020-01-21)


### Bug Fixes

* bump eslint-config-es from 3.19.15 to 3.19.17 ([#237](https://github.com/thenativeweb/roboter/issues/237)) ([45ce1bf](https://github.com/thenativeweb/roboter/commit/45ce1bf5f97bed95c0d241ae25f05b0ad0b3fd76))

# [11.0.0](https://github.com/thenativeweb/roboter/compare/10.2.0...11.0.0) (2020-01-20)


### Bug Fixes

* Release major version after mistaken minor release. ([#235](https://github.com/thenativeweb/roboter/issues/235)) ([ed11cf2](https://github.com/thenativeweb/roboter/commit/ed11cf213b93d6dbd1ace899f4e46a81c5fd4f58))


### BREAKING CHANGES

* This commit releases the previous minor release as
the intended major release.

# [10.2.0](https://github.com/thenativeweb/roboter/compare/10.1.24...10.2.0) (2020-01-20)


### Features

* Update to new Mocha configuration file format. ([#234](https://github.com/thenativeweb/roboter/issues/234)) ([ae91f62](https://github.com/thenativeweb/roboter/commit/ae91f62f1686f6cc0e14b59b01a5e3b745a4b9a5))

## [10.1.24](https://github.com/thenativeweb/roboter/compare/10.1.23...10.1.24) (2020-01-16)


### Bug Fixes

* bump eslint-config-es from 3.19.14 to 3.19.15 ([#233](https://github.com/thenativeweb/roboter/issues/233)) ([0e84097](https://github.com/thenativeweb/roboter/commit/0e84097f1fd9361a68f78eb33c6e025ff1bb8689))

## [10.1.23](https://github.com/thenativeweb/roboter/compare/10.1.22...10.1.23) (2020-01-16)


### Bug Fixes

* bump typescript from 3.7.4 to 3.7.5 ([#232](https://github.com/thenativeweb/roboter/issues/232)) ([eca7f38](https://github.com/thenativeweb/roboter/commit/eca7f382386ed45226bdb8b068b1df9688a44ed0))

## [10.1.22](https://github.com/thenativeweb/roboter/compare/10.1.21...10.1.22) (2020-01-14)


### Bug Fixes

* bump globby from 10.0.1 to 11.0.0 ([#219](https://github.com/thenativeweb/roboter/issues/219)) ([210c14f](https://github.com/thenativeweb/roboter/commit/210c14f0e34a48b56fa218cae7b6226d7eadd64a))

## [10.1.21](https://github.com/thenativeweb/roboter/compare/10.1.20...10.1.21) (2020-01-14)


### Bug Fixes

* bump eslint-config-es from 3.19.12 to 3.19.14 ([#230](https://github.com/thenativeweb/roboter/issues/230)) ([af3285b](https://github.com/thenativeweb/roboter/commit/af3285b9b51132acb58a85298d262f27ac377f96))

## [10.1.20](https://github.com/thenativeweb/roboter/compare/10.1.19...10.1.20) (2020-01-13)


### Bug Fixes

* bump ts-node from 8.6.1 to 8.6.2 ([#228](https://github.com/thenativeweb/roboter/issues/228)) ([067cf12](https://github.com/thenativeweb/roboter/commit/067cf1258c71723c1f1793f48fdaaee20a03874b))

## [10.1.19](https://github.com/thenativeweb/roboter/compare/10.1.18...10.1.19) (2020-01-10)


### Bug Fixes

* bump ts-node from 8.6.0 to 8.6.1 ([#227](https://github.com/thenativeweb/roboter/issues/227)) ([de2e578](https://github.com/thenativeweb/roboter/commit/de2e578c9c51f8a8c486c87a88a617b30f1843be))

## [10.1.18](https://github.com/thenativeweb/roboter/compare/10.1.17...10.1.18) (2020-01-10)


### Bug Fixes

* bump ts-node from 8.5.4 to 8.6.0 ([#225](https://github.com/thenativeweb/roboter/issues/225)) ([8776e34](https://github.com/thenativeweb/roboter/commit/8776e3447f0f01c3a97c66434877621e03b1aadd))

## [10.1.17](https://github.com/thenativeweb/roboter/compare/10.1.16...10.1.17) (2020-01-07)


### Bug Fixes

* bump axios from 0.19.0 to 0.19.1 ([#223](https://github.com/thenativeweb/roboter/issues/223)) ([6fdb57a](https://github.com/thenativeweb/roboter/commit/6fdb57a96e7d6de1ee0a7f26a0fb0ee9cf23cbc8))

## [10.1.16](https://github.com/thenativeweb/roboter/compare/10.1.15...10.1.16) (2020-01-07)


### Bug Fixes

* bump eslint-config-es from 3.19.10 to 3.19.12 ([#222](https://github.com/thenativeweb/roboter/issues/222)) ([3b50396](https://github.com/thenativeweb/roboter/commit/3b5039606d7b6853b05c2ab3c02228d9f8dc5837))

## [10.1.15](https://github.com/thenativeweb/roboter/compare/10.1.14...10.1.15) (2020-01-07)


### Bug Fixes

* bump buntstift from 3.0.2 to 3.0.3 ([#221](https://github.com/thenativeweb/roboter/issues/221)) ([108146c](https://github.com/thenativeweb/roboter/commit/108146cfe15c068960b1719cfc588a66b122db4a))

## [10.1.14](https://github.com/thenativeweb/roboter/compare/10.1.13...10.1.14) (2020-01-05)


### Bug Fixes

* bump buntstift from 3.0.1 to 3.0.2 ([#217](https://github.com/thenativeweb/roboter/issues/217)) ([af7baad](https://github.com/thenativeweb/roboter/commit/af7baadb32ad6e9e3f21bee09ff1029a4df6c785))

## [10.1.13](https://github.com/thenativeweb/roboter/compare/10.1.12...10.1.13) (2020-01-04)


### Bug Fixes

* bump mocha from 6.2.2 to 7.0.0 ([#216](https://github.com/thenativeweb/roboter/issues/216)) ([d4e3c99](https://github.com/thenativeweb/roboter/commit/d4e3c99b93ed6aa5753a1418a0f5bdd202682130))

## [10.1.12](https://github.com/thenativeweb/roboter/compare/10.1.11...10.1.12) (2020-01-01)


### Bug Fixes

* bump eslint-config-es from 3.19.9 to 3.19.10 ([#215](https://github.com/thenativeweb/roboter/issues/215)) ([6ada4e3](https://github.com/thenativeweb/roboter/commit/6ada4e374e4455cff212bd9966f5edcf0c869820))

## [10.1.11](https://github.com/thenativeweb/roboter/compare/10.1.10...10.1.11) (2019-12-30)


### Bug Fixes

* bump eslint-config-es from 3.19.8 to 3.19.9 ([#214](https://github.com/thenativeweb/roboter/issues/214)) ([36ae7ba](https://github.com/thenativeweb/roboter/commit/36ae7ba898847536605bcb186ff6345103648575))

## [10.1.10](https://github.com/thenativeweb/roboter/compare/10.1.9...10.1.10) (2019-12-28)


### Bug Fixes

* bump async-af from 7.0.38 to 7.0.39 ([#213](https://github.com/thenativeweb/roboter/issues/213)) ([2a76395](https://github.com/thenativeweb/roboter/commit/2a76395b7c687badb317d2925f6de097713e1163))

## [10.1.9](https://github.com/thenativeweb/roboter/compare/10.1.8...10.1.9) (2019-12-27)


### Bug Fixes

* bump eslint-config-es from 3.19.5 to 3.19.8 ([#212](https://github.com/thenativeweb/roboter/issues/212)) ([3eb635a](https://github.com/thenativeweb/roboter/commit/3eb635a6e03ce2e22af1211113a4a26382aba489))

## [10.1.8](https://github.com/thenativeweb/roboter/compare/10.1.7...10.1.8) (2019-12-23)


### Bug Fixes

* Add parantheses to broken license string. ([#209](https://github.com/thenativeweb/roboter/issues/209)) ([95d6c84](https://github.com/thenativeweb/roboter/commit/95d6c8481d213401a6a36ee95365b6e9a03a3ad4))

## [10.1.7](https://github.com/thenativeweb/roboter/compare/10.1.6...10.1.7) (2019-12-23)


### Bug Fixes

* bump eslint-config-es from 3.19.4 to 3.19.5 ([#207](https://github.com/thenativeweb/roboter/issues/207)) ([377f17a](https://github.com/thenativeweb/roboter/commit/377f17a284d4300f6011326b59688bc2150a7c39))

## [10.1.6](https://github.com/thenativeweb/roboter/compare/10.1.5...10.1.6) (2019-12-23)


### Bug Fixes

* Add LGPL-OR-MIT as compatible to various licenses. ([#208](https://github.com/thenativeweb/roboter/issues/208)) ([bc9b96e](https://github.com/thenativeweb/roboter/commit/bc9b96e6b31a70333847e2d0d672d00206b99b46))

## [10.1.5](https://github.com/thenativeweb/roboter/compare/10.1.4...10.1.5) (2019-12-20)


### Bug Fixes

* bump typescript from 3.7.3 to 3.7.4 ([#205](https://github.com/thenativeweb/roboter/issues/205)) ([72c7ea7](https://github.com/thenativeweb/roboter/commit/72c7ea74c7f276a72d2d16c79502c7af6d14a748))

## [10.1.4](https://github.com/thenativeweb/roboter/compare/10.1.3...10.1.4) (2019-12-20)


### Bug Fixes

* bump eslint from 6.7.2 to 6.8.0 ([#204](https://github.com/thenativeweb/roboter/issues/204)) ([dbce759](https://github.com/thenativeweb/roboter/commit/dbce759e09924e78234d8c409bc1e7399b9a4d1e))

## [10.1.3](https://github.com/thenativeweb/roboter/compare/10.1.2...10.1.3) (2019-12-17)


### Bug Fixes

* bump semver from 7.1.0 to 7.1.1 ([#203](https://github.com/thenativeweb/roboter/issues/203)) ([a89c766](https://github.com/thenativeweb/roboter/commit/a89c766827743b99b7dad827f3dba2bf963afbd0))

## [10.1.2](https://github.com/thenativeweb/roboter/compare/10.1.1...10.1.2) (2019-12-17)


### Bug Fixes

* bump semver from 7.0.0 to 7.1.0 ([#202](https://github.com/thenativeweb/roboter/issues/202)) ([1242fcd](https://github.com/thenativeweb/roboter/commit/1242fcd5be36ec617535000d432d8f9bd2ca8173))

## [10.1.1](https://github.com/thenativeweb/roboter/compare/10.1.0...10.1.1) (2019-12-17)


### Bug Fixes

* bump eslint-config-es from 3.19.2 to 3.19.4 ([#201](https://github.com/thenativeweb/roboter/issues/201)) ([ade0966](https://github.com/thenativeweb/roboter/commit/ade0966af7d006bb1df8d1a6d33111397622873b))

# [10.1.0](https://github.com/thenativeweb/roboter/compare/10.0.6...10.1.0) (2019-12-16)


### Features

* Release new version. ([1d71f35](https://github.com/thenativeweb/roboter/commit/1d71f355107c2534a42aacff8f05fb1428cc183e))

## [10.0.6](https://github.com/thenativeweb/roboter/compare/10.0.5...10.0.6) (2019-12-15)


### Bug Fixes

* bump buntstift from 3.0.0 to 3.0.1 ([#198](https://github.com/thenativeweb/roboter/issues/198)) ([2c2f254](https://github.com/thenativeweb/roboter/commit/2c2f2547f6e6c20880d33b3428c7c8b90c8ad4d0))

## [10.0.5](https://github.com/thenativeweb/roboter/compare/10.0.4...10.0.5) (2019-12-14)


### Bug Fixes

* bump semver from 6.3.0 to 7.0.0 ([#197](https://github.com/thenativeweb/roboter/issues/197)) ([2c00887](https://github.com/thenativeweb/roboter/commit/2c0088751ed87bfd08868d3d87f09f49e27c1e81))

## [10.0.4](https://github.com/thenativeweb/roboter/compare/10.0.3...10.0.4) (2019-12-09)


### Bug Fixes

* bump eslint-config-es from 3.19.0 to 3.19.2 ([#196](https://github.com/thenativeweb/roboter/issues/196)) ([dc07fde](https://github.com/thenativeweb/roboter/commit/dc07fde75f824fca8efed453a6c5b4bb33935adc))

## [10.0.3](https://github.com/thenativeweb/roboter/compare/10.0.2...10.0.3) (2019-12-04)


### Bug Fixes

* bump processenv from 3.0.0 to 3.0.1 ([#194](https://github.com/thenativeweb/roboter/issues/194)) ([e37b3fc](https://github.com/thenativeweb/roboter/commit/e37b3fc4bfabff5aa8ba960e9450f28c87e04669))

## [10.0.2](https://github.com/thenativeweb/roboter/compare/10.0.1...10.0.2) (2019-12-04)


### Bug Fixes

* bump typescript from 3.7.2 to 3.7.3 ([#193](https://github.com/thenativeweb/roboter/issues/193)) ([6d6b8b3](https://github.com/thenativeweb/roboter/commit/6d6b8b3b39d46ef1f2c0d19ba49d32f158e4e6c9))

## [10.0.1](https://github.com/thenativeweb/roboter/compare/10.0.0...10.0.1) (2019-12-03)


### Bug Fixes

* bump eslint-config-es from 3.18.1 to 3.19.0 ([#192](https://github.com/thenativeweb/roboter/issues/192)) ([181c25a](https://github.com/thenativeweb/roboter/commit/181c25a691847d4fc779a2bf5e1631a661205e02))

# [10.0.0](https://github.com/thenativeweb/roboter/compare/v9.2.6...10.0.0) (2019-11-29)


### Bug Fixes

* Update whitelisted dependencies. ([#187](https://github.com/thenativeweb/roboter/issues/187)) ([ae9cdca](https://github.com/thenativeweb/roboter/commit/ae9cdcaf7e84759e0b8d165cda120ecc49cbd263))


### BREAKING CHANGES

* The remove command was dropped. Use semantic-release instead.
