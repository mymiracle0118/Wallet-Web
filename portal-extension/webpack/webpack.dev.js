const common = require('./webpack.common.js')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const getManifestFile = require('./manifest-file')
const { merge } = require('webpack-merge')
const ExtensionReloader = require('webpack-ext-reloader-mv3')
const CWD_PATH = fs.realpathSync(process.cwd())
const PUBLIC_PATH = path.join(CWD_PATH, 'public')
const DEST_PATH = path.join(CWD_PATH, '../')
const OUTPUT_PATH = path.join(DEST_PATH, `extension`)
const SOURCE_PATH = path.join(CWD_PATH, 'src')

const HTML_TEMPLATES = [
  {
    path: path.join(PUBLIC_PATH, 'popup.html'),
    chunks: ['popup'],
  },
  {
    path: path.join(PUBLIC_PATH, 'fullpage.html'),
    chunks: ['fullpage'],
  },
]

const ENTRIES = {
  popup: path.join(SOURCE_PATH, 'popup.tsx'),
  fullpage: path.join(SOURCE_PATH, 'fullpage.tsx'),
  background: path.join(SOURCE_PATH, 'background.ts'),
  confirm: path.join(SOURCE_PATH, 'confirm.tsx'),
  contentScript: path.join(SOURCE_PATH, 'contentScript.ts'),
}

const RELOADER_ENTRIES = {
  contentScript: 'contentScript',
  background: 'background',
  extensionPage: ['popup', 'fullpage', 'confirm', 'options', 'commons.chunk'],
}
module.exports = merge(common, {
  mode: 'development',
  entry: ENTRIES,
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new Dotenv({
      systemvars: true,
    }),

    new CopyWebpackPlugin({
      patterns: [{ from: './public/images', to: 'images/' }, getManifestFile()],
    }),

    new webpack.DefinePlugin({
      'process.env': {
        RUN_VERCEL: false,
      },
    }),

    new WebpackBar({
      name: 'Shuttle Wallet',
      color: '#2ecc71',
    }),
    new ExtensionReloader({
      port: 9090,
      reloadPage: true,
      // manifest: path.join(OUTPUT_PATH, "manifest.json"),
      entries: RELOADER_ENTRIES,
    }),

    ...HTML_TEMPLATES.map(
      (htmlTemplate) =>
        new HtmlWebpackPlugin({
          template: htmlTemplate.path,
          filename: path.basename(htmlTemplate.path),
          chunks: [...htmlTemplate.chunks, 'commons'],
          inject: 'body',
          templateParameters(compilation, assets, options) {
            return {
              compilation: compilation,
              webpack: compilation.getStats().toJson(),
              webpackConfig: compilation.options,
              htmlWebpackPlugin: {
                files: assets,
                options: options,
              },
              process,
            }
          },
        })
    ),
  ],
  output: {
    path: OUTPUT_PATH,
    pathinfo: true,
    filename: 'scripts/[name].js',
    chunkFilename: 'scripts/[name].chunk.js',
  },
})
