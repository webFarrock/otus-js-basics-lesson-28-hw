const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");

const { NODE_ENV } = process.env;

module.exports = {
  entry: resolve(__dirname, "src/js/index.ts"),
  resolve: {
    extensions: [".js", ".ts"],
  },
  output: {
    filename: "bundle.js",
    path: resolve(`${__dirname}/dist`),
    clean: true,
    environment: {
      arrowFunction: false,
    },
  },
  devtool: NODE_ENV === "production" ? "hidden-source-map" : "eval-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  mode: NODE_ENV === "production" ? "production" : "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, "index.html"),
    }),
  ],
  devServer: {
    compress: true,
    port: 9000,
    client: {
      logging: "info",
    },
  },
};
