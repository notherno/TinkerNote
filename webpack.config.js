const path = require('path')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const distDirName = path.resolve(__dirname, 'dist')

module.exports = (_, argv) => {
  const isDev = argv.mode === 'development'

  const rules = [
    {
      test: /\.tsx?/,
      use: [{ loader: 'ts-loader' }],
    },
    {
      test: /\.html$/,
      loader: 'html-loader',
    },
    {
      test: /\.css$/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    },
    {
      test: /\.svg$/,
      loader: 'url-loader',
      options: { mimetype: 'image/svg+xml', name: '[path][name].[ext]' },
    },
    {
      test: /\.woff$/,
      loader: 'url-loader',
      options: {
        mimetype: 'application/font-woff',
        name: '[path][name].[ext]',
      },
    },
    {
      test: /\.woff2$/,
      loader: 'url-loader',
      options: {
        mimetype: 'application/font-woff2',
        name: '[path][name].[ext]',
      },
    },
    {
      test: /\.[ot]tf$/,
      loader: 'url-loader',
      options: {
        mimetype: 'application/octet-stream',
        name: '[path][name].[ext]',
      },
    },
    {
      test: /\.eot$/,
      loader: 'url-loader',
      options: {
        mimetype: 'application/vnd.ms-fontobject',
        name: '[path][name].[ext]',
      },
    },
  ]

  const plugins = [
    new CleanPlugin([path.resolve(distDirName, './**/*.*')], {
      root: __dirname,
      dry: false,
      verbose: true,
      watch: !!argv.watch,
      allowExternal: true,
    }),
    new HtmlPlugin({
      template: path.resolve(__dirname, 'index.html'),
      chunks: ['index'],
    }),
    new HtmlPlugin({
      filename: 'window.html',
      template: path.resolve(__dirname, 'window.html'),
      chunks: ['window'],
    }),
  ]

  return {
    devtool: isDev ? 'inline-source-map' : false,
    entry: {
      index: path.resolve(__dirname, './src/index'),
      window: path.resolve(__dirname, './src/window'),
    },
    devServer: {
      contentBase: distDirName,
      port: 3000,
    },
    resolve: {
      extensions: ['.js', '.ts'],
    },
    output: {
      filename: 'bundles/[name]-[hash].js',
      path: distDirName,
    },
    performance: {
      hints: false,
    },
    module: { rules },
    optimization: {
      minimize: !isDev,
    },
    plugins,
  }
}
