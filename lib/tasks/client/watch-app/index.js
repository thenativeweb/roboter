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
  port: 8080,
  contentBase: buildDirectory,

  debug: false,
  bail: false,
  entry: [
    path.join(srcDirectory, 'index.html'),
    path.join(srcDirectory, 'index.scss'),
    path.join(srcDirectory, 'index.js')
  ],
  target: 'web',
  output: {
    path: buildDirectory,
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

const watchApp = function (roboter, userConfiguration) {
  userConfiguration.output = {};
  userConfiguration.output.path = userConfiguration.buildDir;
  Reflect.deleteProperty(userConfiguration, 'buildDir');

  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  configuration.entry.unshift('webpack-dev-server/client?http://localhost:8080/');

  gulp.task('_watch-app', done => {
    roboter.isWatching = true;
    const compiler = webpack(configuration);

    const server = new WebpackDevServer(compiler, {
      hot: false,
      contentBase: configuration.contentBase,
      historyApiFallback: false,
      compress: true,
      quiet: false,
      noInfo: true,
      lazy: false,
      filename: configuration.output.filename,
      stats: { colors: true }
    });

    server.listen(configuration.port, 'localhost', () => {
      gutil.log('I\'v build your app and put it here http://localhost:8080/');

      done();
    });
  });
};

module.exports = watchApp;
