'use strict';

const path = require('path');

const _ = require('lodash'),
      autoprefixer = require('autoprefixer'),
      del = require('del'),
      glob = require('glob'),
      gulp = require('gulp'),
      gutil = require('gulp-util'),
      webpack = require('webpack');

const buildDirectory = path.join(process.cwd(), 'build'),
      srcDirectory = path.join(process.cwd(), 'src');

const defaultConfiguration = {
  babelize: [
    srcDirectory
  ],
  basePath: '/',
  buildDir: buildDirectory,
  entryFiles: glob.sync(path.join(srcDirectory, 'index.*'))
};

const getWebpackConfiguration = function (configuration) {
  return {
    bail: true,
    context: srcDirectory,
    entry: configuration.entryFiles,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          include: configuration.babelize,
          use: [
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
            { loader: 'css-loader' },
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
      publicPath: configuration.basePath
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: false,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }})
    ],
    target: 'web'
  };
};

const buildApp = function (roboter, userConfiguration) {
  const configuration = _.assign({}, defaultConfiguration, userConfiguration);
  const webpackConfiguration = getWebpackConfiguration(configuration);

  gulp.task('_build-app', done => {
    del.sync([
      configuration.buildDir
    ]);

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
