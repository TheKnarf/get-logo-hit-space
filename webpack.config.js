const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: "raw-loader" },
      { test: /CNAME$/, loader: "file-loader", options: { name: "CNAME" } },
      { test: /\.css$/, loader: "file-loader", options: { name: "index.css" } },
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/index.html" },
        { from: "node_modules/figlet/fonts", to: "fonts" },
      ],
    }),
  ],
  devtool: "inline-source-map",
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
};
