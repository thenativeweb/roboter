'use strict';

const path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack');

const buildDirectory = path.join(process.cwd(), 'build'),
      srcDirectory = path.join(process.cwd(), 'src');

const defaultConfiguration = {
  debug: false,
  bail: true,
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
        loader: 'babel'
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
    new ExtractTextPlugin('index.css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': 'production',
      __DEV__: false
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ]
};

const buildApp = function (roboter, userConfiguration) {
  userConfiguration.output = {};
  userConfiguration.output.path = userConfiguration.buildDir;
  Reflect.deleteProperty(userConfiguration, 'buildDir');

  const configuration = _.assign({}, defaultConfiguration, userConfiguration);

  gulp.task('_build-app', done => {
    const compiler = webpack(configuration);

    compiler.run((err, stats) => {
      if (err) {
        return done(err);
      }

      gutil.log(stats.toString({ colors: true }));

      return done();
    });
  });
};

module.exports = buildApp;
