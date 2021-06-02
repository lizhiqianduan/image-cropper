const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: {
      lib:'./src/lib.js',
      test:'./src/test.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'build')
  }
  
};