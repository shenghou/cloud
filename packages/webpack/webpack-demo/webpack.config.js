const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: "./app/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: "/.js$/",
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: "/.(png|jpe?g|gif|svg)(?.*)?$/",
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
              name: "image/[name].[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: ExtractTextPlugin({
              fallback: "style-loader",
              use: [
                {
                  loader: "css-loader",
                  options: {
                    modules: true
                  }
                }
              ]
            }),
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  plugins: [new ExtractTextPlugin("css/[name].[hash].css")]
};
