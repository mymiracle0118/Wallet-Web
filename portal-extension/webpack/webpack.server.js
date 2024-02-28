const common = require('./webpack.common.js')
const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const getManifestFile = require('./manifest-file')
const { merge } = require('webpack-merge')

const CWD_PATH = fs.realpathSync(process.cwd())
const PUBLIC_PATH = path.join(CWD_PATH, 'publicVercel')
const SOURCE_PATH = path.join(CWD_PATH, 'src')

module.exports = merge(common, {
  entry: path.join(SOURCE_PATH, 'vercel.tsx'),
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './public/images', to: 'images/' }, getManifestFile()],
    }),
    new HtmlWebpackPlugin({
      template: path.join(PUBLIC_PATH, 'index.html'),
      favicon: './publicVercel/favicon.ico',
      filename: 'index.html',
      manifest: './publicVercel/manifest.json',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        RUN_VERCEL: true,
      },
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../build'),
  },
  devServer: {
    port: 3000,
  },
})
