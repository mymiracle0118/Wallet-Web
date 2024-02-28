const path = require('path')

const fs = require('fs')
const tsConfig = require('../tsconfig.json')

const CWD_PATH = fs.realpathSync(process.cwd())

const ADDITIONAL_MODULE_PATHS = [
  tsConfig.compilerOptions.baseUrl && path.join(CWD_PATH, tsConfig.compilerOptions.baseUrl),
]

const config = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [{ loader: '@svgr/webpack', options: { icon: true } }],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
      {
        test: /\path.svg$/,
        /* Exclude fonts while working with images, e.g. .svg can be both image or font. */
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', ...ADDITIONAL_MODULE_PATHS],
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      stream: false,
      buffer: require.resolve('buffer/'),
    },
    alias: {
      assets: path.resolve(__dirname, '../src/assets/'),
      components: path.resolve(__dirname, '../src/app/components/'),
      layouts: path.resolve(__dirname, '../src/app/layouts/'),
      pages: path.resolve(__dirname, '../src/app/pages/'),
      theme: path.resolve(__dirname, '../src/theme/'),
      lib: path.resolve(__dirname, '../src/lib/'),
      '@src': path.resolve(__dirname, '../src/'),
    },
  },
}

module.exports = config
