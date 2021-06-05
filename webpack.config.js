const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/i, use: "raw-loader" },
      { test: /CNAME$/, loader: "file-loader", options: { name: "CNAME" } },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      { test: /\.js$/i, exclude: /node_modules/, loader: "babel-loader" },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "node_modules/figlet/fonts", to: "fonts" }],
    }),
    new HtmlWebpackPlugin({
      title: "Get logo, hit space",
    }),
  ],
  devtool: "inline-source-map",
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
    },
  },
};
