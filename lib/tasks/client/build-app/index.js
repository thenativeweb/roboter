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
    debug: false,
    entry: configuration.entryFiles,
    module: {
      loaders: [
        {
          include: configuration.babelize,
          loader: 'babel',
          test: /\.jsx?$/
        }, {
          loader: 'file',
          query: { name: '[name].[ext]' },
          test: /\.html$/
        }, {
          loader: 'style!css!postcss!sass',
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
      publicPath: configuration.basePath
    },
    plugins: [
      // Set NODE_ENV to production in order for React to exclude its dev warnings.
      new webpack.DefinePlugin({
        __DEV__: false,
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      // Optimize chunk ids by occurrence count to reduce file size.
      new webpack.optimize.OccurenceOrderPlugin(),

      // Search and merge all duplicate modules to reduce file size.
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }})
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
