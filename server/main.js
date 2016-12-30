const express = require('express');
const http = require('http');
const debug = require('debug')('app:server');
const webpack = require('webpack');
const webpackConfig = require('../build/webpack.config');
const config = require('../config');

const app = express();
const paths = config.utils_paths;

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
const compiler = webpack(webpackConfig);

debug('Enable webpack dev and HMR middleware');

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: paths.client(),
  hot: true,
  quiet: config.compiler_quiet,
  noInfo: config.compiler_quiet,
  lazy: false,
  stats: config.compiler_stats
}))

app.use(require('webpack-hot-middleware')(compiler, {
  publicPath: config.compiler_public_path
}));

module.exports = app
