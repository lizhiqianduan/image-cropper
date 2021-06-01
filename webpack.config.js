const path = require('path');

module.exports = {
  entry: {
      lib:'./src/lib.js',
      test:'./src/test.js'
  },
  devtool: 'source-map',
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'build')
  }
};