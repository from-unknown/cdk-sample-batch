import merge from 'webpack-merge';
const common = require('./webpack.config.ts');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
});
