'use strict';

const fs = require('fs'),
      path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      del = require('del'),
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
  babelize: [
    srcDirectory
  ],
  host: 'localhost',
  port: 8080,
  hotReloading: true
};

const isReactUsed = function () {
  /* eslint-disable no-sync */
  return fs.existsSync(path.join(__dirname, '..', '..', '..', '..', '..', 'react'));
  /* eslint-enable no-sync */
};

const getWebpackConfiguration = function (configuration) {
  return {
    debug: false,
    bail: false,
    context: srcDirectory,
    entry: configuration.entryFiles,
    devtool: 'source-map',
    target: 'web',
    output: {
      path: configuration.buildDir,
      publicPath: `http://${configuration.host}:${configuration.port}/`,
      filename: 'index.js'
    },
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: configuration.babelize,
          loader: configuration.hotReloading && isReactUsed() ? 'react-hot!babel' : 'babel'
        }, {
          test: /\.html$/,
          loader: 'file',
          query: { name: '[name].[ext]' }
        }, {
          test: /(\.css|\.scss)$/,
          loader: 'style!css?sourceMap!postcss!sass'
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ]
  };
};

const watchApp = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);
  const webpackConfiguration = getWebpackConfiguration(configuration);
  const baseUrl = `http://${configuration.host}:${configuration.port}/`;

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
      hot: configuration.hotReloading,
      contentBase: configuration.buildDir,
      historyApiFallback: false,
      compress: true,
      quiet: false,
      noInfo: true,
      lazy: false,
      filename: webpackConfiguration.output.filename,
      stats: { colors: true }
    });

    server.listen(configuration.port, configuration.host, () => {
      gutil.log(`I've built your app and put it here: http://${configuration.host}:${configuration.port}/`);
      done();
    });
  });
};

module.exports = watchApp;
