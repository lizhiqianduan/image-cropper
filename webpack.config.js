const path = require('path');

module.exports = {
  entry: {
      lib:'./src/lib.js',
      test:'./src/test.js'
  },
  devtool: 'cheap-module-eval-source-map',
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'build')
  }
};