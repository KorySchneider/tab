const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',

  output: {
    path: __dirname + '/dist',
    filename: 'index.bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'taab',
      template: __dirname + '/src/template.html',
      filename: __dirname + '/dist/index.html',
      minify: true
    })
  ]
}
