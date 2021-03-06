const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const DIRNAME = __dirname + '/../';

module.exports = {
  devtool: 'inline-source-map',

  devServer: {
    hot: true,
    publicPath: '/',
    port: 3000,
  },

  resolve: {
    modules: [
      path.join(DIRNAME, 'src', 'web'),
      'node_modules',
    ],
  },

  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3000',
    path.resolve(DIRNAME, 'src', 'web'),
  ],

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: path.resolve(DIRNAME),
        use: [
          'babel-loader',
          'eslint-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    new StyleLintPlugin({
      files: 'src/web/**/*.css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(DIRNAME, 'src', 'web', 'index.html'),
      inject: 'body',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
};
