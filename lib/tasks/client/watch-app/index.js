'use strict';

const path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack'),
      WebpackDevServer = require('webpack-dev-server');

const buildDirectory = path.join(process.cwd(), 'build'),
      srcDirectory = path.join(process.cwd(), 'src');

const defaultConfiguration = {
  entryFiles: [
    path.join(srcDirectory, 'index.html'),
    path.join(srcDirectory, 'index.scss'),
    path.join(srcDirectory, 'index.js')
  ],
  buildDir: buildDirectory,
  port: 8080
};

const getWebpackConfiguration = function (configuration) {
  return {
    debug: false,
    bail: false,
    entry: configuration.entryFiles,
    target: 'web',
    output: {
      path: configuration.buildDir,
      publicPath: '/',
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: 'node_modules',
          loaders: [ 'babel' ]
        }, {
          test: /\.html$/,
          loader: 'file',
          query: { name: '[name].[ext]' }
        }, {
          test: /(\.css|\.scss)$/,
          loader: ExtractTextPlugin.extract('css!postcss!sass')
        }, {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'file',
          query: { prefix: 'font/' }
        }, {
          test: /\.(svg|jpe?g|png|gif|ico)$/i,
          loader: 'file'
        }
      ]
    },
    postcss: [ autoprefixer() ],
    plugins: [
      new ExtractTextPlugin('index.css')
    ]
  };
};

const watchApp = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);
  const webpackConfiguration = getWebpackConfiguration(configuration);

  webpackConfiguration.entry.unshift(`webpack-dev-server/client?http://localhost:${configuration.port}/`);

  gulp.task('_watch-app', done => {
    roboter.isWatching = true;
    const compiler = webpack(webpackConfiguration);

    const server = new WebpackDevServer(compiler, {
      hot: false,
      contentBase: configuration.buildDir,
      historyApiFallback: false,
      compress: true,
      quiet: false,
      noInfo: true,
      lazy: false,
      filename: webpackConfiguration.output.filename,
      stats: { colors: true }
    });

    server.listen(configuration.port, 'localhost', () => {
      gutil.log(`I've built your app and put it here: http://localhost:${configuration.port}/`);
      done();
    });
  });
};

module.exports = watchApp;
