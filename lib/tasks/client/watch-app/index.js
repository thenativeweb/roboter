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
  babelize: [
    srcDirectory
  ],
  buildDir: buildDirectory,
  entryFiles: [
    path.join(srcDirectory, 'index.html'),
    path.join(srcDirectory, 'index.scss'),
    path.join(srcDirectory, 'index.js')
  ],
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
  return {
    bail: false,
    context: srcDirectory,
    debug: false,
    devtool: 'source-map',
    entry: configuration.entryFiles,
    module: {
      loaders: [
        {
          include: configuration.babelize,
          loader: configuration.hotReloading && isReactUsed() ? 'react-hot!babel' : 'babel',
          test: /\.jsx?$/
        }, {
          loader: 'file',
          query: { name: '[name].[ext]' },
          test: /\.html$/
        }, {
          loader: 'style!css?sourceMap!postcss!sass',
          test: /(\.css|\.scss)$/
        }, {
          loader: 'file',
          query: { prefix: 'font/' },
          test: /\.(woff|woff2|eot|ttf)$/
        }, {
          loader: 'file',
          test: /\.(svg|jpe?g|png|gif|ico)$/i
        }
      ]
    },
    output: {
      filename: 'index.js',
      path: configuration.buildDir,
      publicPath: `http://${configuration.host}:${configuration.port}/`
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ],
    postcss: [ autoprefixer() ],
    sassLoader: {
      includePaths: [
        './node_modules'
      ]
    },
    target: 'web'
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
      compress: true,
      contentBase: configuration.buildDir,
      filename: webpackConfiguration.output.filename,
      historyApiFallback: false,
      hot: configuration.hotReloading,
      lazy: false,
      noInfo: true,
      quiet: false,
      stats: { colors: true }
    });

    server.listen(configuration.port, configuration.host, () => {
      gutil.log(`I've built your app and put it here: http://${configuration.host}:${configuration.port}/`);
      done();
    });
  });
};

module.exports = watchApp;
