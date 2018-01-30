'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      del = require('del'),
      glob = require('glob'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server');

const buildDirectory = path.join(process.cwd(), 'build'),
      srcDirectory = path.join(process.cwd(), 'src');

const defaultConfiguration = {
  babelize: [
    srcDirectory
  ],
  buildDir: buildDirectory,
  define: { 'process.env.NODE_ENV': 'development' },
  entryFiles: glob.sync(path.join(srcDirectory, 'index.*')),
  host: 'localhost',
  hotReloading: true,
  port: 8080
};

const isReactUsed = function () {
  /* eslint-disable no-sync */
  return fs.existsSync(path.join(__dirname, '..', '..', '..', '..', '..', 'react'));
  /* eslint-enable no-sync */
};

const getWebpackConfiguration = function (configuration) {
  const definitions = {};

  Object.keys(configuration.define).forEach(key => {
    definitions[key] = JSON.stringify(configuration.define[key]);
  });

  return {
    bail: false,
    context: srcDirectory,
    devtool: 'source-map',
    entry: configuration.entryFiles,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: configuration.babelize,
          use: configuration.hotReloading && isReactUsed() ?
            [
              { loader: 'react-hot-loader' },
              { loader: 'babel-loader' }
            ] :
            [
              { loader: 'babel-loader' }
            ]
        }, {
          test: /\.html$/,
          use: [
            { loader: 'file-loader', options: { name: '[name].[ext]' }}
          ]
        }, {
          test: /(\.css|\.scss)$/,
          use: [
            { loader: 'style-loader' },
            { loader: 'css-loader', options: { sourceMap: true }},
            { loader: 'postcss-loader', options: { plugins: () => [ autoprefixer ]}},
            { loader: 'sass-loader', options: { includePaths: [ './node_modules' ]}}
          ]
        }, {
          test: /\.(woff|woff2|eot|ttf)$/,
          use: [
            { loader: 'file-loader', options: { prefix: 'font/' }}
          ]
        }, {
          test: /\.(svg|jpe?g|png|gif|ico)$/i,
          use: [
            { loader: 'file-loader' }
          ]
        }
      ]
    },
    output: {
      filename: 'index.js',
      path: configuration.buildDir,
      publicPath: `${configuration.https ? 'https' : 'http'}://${configuration.host}:${configuration.port}/`
    },
    plugins: [
      new webpack.DefinePlugin(definitions),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    target: 'web'
  };
};

const watchApp = function (roboter, userConfiguration) {
  const configuration = _.merge({}, defaultConfiguration, userConfiguration);
  const webpackConfiguration = getWebpackConfiguration(configuration);
  const baseUrl = `${configuration.https ? 'https' : 'http'}://${configuration.host}:${configuration.port}/`;

  webpackConfiguration.entry.unshift(`webpack-dev-server/client?${baseUrl}`);

  if (configuration.hotReloading) {
    webpackConfiguration.entry.unshift('webpack/hot/dev-server');
  }

  gulp.task('_watch-app', done => {
    roboter.isWatching = true;

    del.sync([
      configuration.buildDir
    ]);

    const compiler = webpack(webpackConfiguration);

    const server = new WebpackDevServer(compiler, {
      compress: true,
      contentBase: configuration.buildDir,
      filename: webpackConfiguration.output.filename,
      historyApiFallback: false,
      hot: configuration.hotReloading,
      lazy: false,
      noInfo: true,
      quiet: false,
      stats: { colors: true },

      host: configuration.host,
      port: configuration.port,
      https: configuration.https
    });

    server.listen(configuration.port, configuration.host, () => {
      gutil.log(`I've built your app and put it here: ${configuration.https ? 'https' : 'http'}://${configuration.host}:${configuration.port}/`);
      done();
    });
  });
};

module.exports = watchApp;
