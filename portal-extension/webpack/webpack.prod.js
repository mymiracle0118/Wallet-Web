const common = require('./webpack.common.js')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const WebpackBar = require('webpackbar')
const getManifestFile = require('./manifest-file')
const { merge } = require('webpack-merge')

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

module.exports = merge(common, {
  mode: 'production',
  entry: ENTRIES,
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
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
      name: 'Star Key Wallet',
      color: '#ed8936',
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
