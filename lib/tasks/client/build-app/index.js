'use strict';

const path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack');

const buildDirectory = path.join(process.cwd(), 'build'),
      srcDirectory = path.join(process.cwd(), 'src');

const defaultConfiguration = {
  entryFiles: [
    path.join(srcDirectory, 'index.html'),
    path.join(srcDirectory, 'index.scss'),
    path.join(srcDirectory, 'index.js')
  ],
  buildDir: buildDirectory
};

const getWebpackConfiguration = function (configuration) {
  return {
    debug: false,
    bail: true,
    context: srcDirectory,
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
          exclude: /node_modules/,
          loader: 'babel'
        }, {
          test: /\.html$/,
          loader: 'file',
          query: { name: '[name].[ext]' }
        }, {
          test: /(\.css|\.scss)$/,
          loader: 'style!css!postcss!sass'
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
      // Set NODE_ENV to production in order for React to exclude its dev warnings.
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        __DEV__: false
      }),

      // Optimize chunk ids by occurrence count to reduce file size.
      new webpack.optimize.OccurenceOrderPlugin(),

      // Search and merge all duplicate modules to reduce file size.
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }})
    ]
  };
};

const buildApp = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);
  const webpackConfiguration = getWebpackConfiguration(configuration);

  gulp.task('_build-app', done => {
    const compiler = webpack(webpackConfiguration);

    compiler.run((err, stats) => {
      if (err) {
        return done(err);
      }

      gutil.log(stats.toString({ colors: true, errorDetails: true }));

      return done();
    });
  });
};

module.exports = buildApp;
