const webpack = require('webpack'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    path: __dirname,
    filename: 'bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'taab',
      template: __dirname + '/src/template.html',
      filename: __dirname + '/index.html',
      inlineSource: '.(js|css)$',
      minify: true
    }),

    new HtmlWebpackInlineSourcePlugin()
  ]
}
