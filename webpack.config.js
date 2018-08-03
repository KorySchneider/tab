const webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  entry: __dirname + '/src/index.js',

  output: {
    path: __dirname,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'tab',
      template: __dirname + '/src/template.html',
      filename: __dirname + '/index.html',
      inlineSource: '.(js|css)$',
      minify: true
    }),

    new HtmlWebpackInlineSourcePlugin()
  ]
}
