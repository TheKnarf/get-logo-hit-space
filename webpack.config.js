var path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
  	library: 'app',
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: 'src/index.html'
    }]),
    new CopyWebpackPlugin([{
      from: 'node_modules/figlet/fonts',
      to: 'fonts'
    }])
  ],
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
