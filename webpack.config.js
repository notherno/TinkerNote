const path = require('path')
const CleanPlugin = require('clean-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')

const distDirName = path.resolve(__dirname, 'dist')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  const rules = [
    {
      test: /\.html$/,
      loader: 'html-loader',
    },
    {
      test: /\.css$/,
      use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
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
    }),
    new HtmlPlugin({
      filename: 'window.html',
      template: path.resolve(__dirname, 'window.html'),
    }),
  ].filter(Boolean)

  return {
    devtool: isDev ? 'inline-source-map' : false,
    entry: {
      index: path.resolve(__dirname, './js/index.js'),
      window: path.resolve(__dirname, './js/window.js'),
    },
    devServer: {
      contentBase: distDirName,
      port: 3000,
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
