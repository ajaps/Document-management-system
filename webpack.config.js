// const Dotenv = require('dotenv-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: ["babel-polyfill", './client/app.js'],
  entry: './client/app.js',
  target: 'web',
  output: { path: path.join(__dirname, 'dist'), filename: 'bundle.js' },
  watch: true,
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
    ],
  },
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  plugins: [
  //   new HtmlWebpackPlugin({
  //     hash: true,
  //     filename: 'index.html'
  //   })
    // new Dotenv({
    //   path: '.env',
    //   safe: false,
    // }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
    new ExtractTextPlugin('main.css'),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     API_KEY: JSON.stringify(process.env.API_KEY),
    //     AUTH_DOMAIN: JSON.stringify(process.env.AUTH_DOMAIN),
    //     DATABASE_URL: JSON.stringify(process.env.DATABASE_URL),
    //     PROJECT_ID: JSON.stringify(process.env.PROJECT_ID),
    //     STORAGE_BUCKET: JSON.stringify(process.env.STORAGE_BUCKET),
    //     MESSAGING_SENDER_ID: JSON.stringify(process.env.MESSAGING_SENDER_ID),
    //     NEWS_API_KEY: JSON.stringify(process.env.NEWS_API_KEY),
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // }),
  ]
};
