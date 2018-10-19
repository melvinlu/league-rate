let path = require("path");

module.exports = {
  context: path.join(__dirname, "/src/client"),
  entry: "./main.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "public/js")
  }
};
