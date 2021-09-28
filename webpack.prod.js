const webpack = require('webpack')

module.exports = {
  mode: 'production',
  entry: {
    'app': ['@babel/polyfill', './src/scripts/app.js']
  },
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  target: ['web', 'es5']
}