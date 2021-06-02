const path = require('path');

module.exports = {
  entry: {
      lib:'./src/lib.js',
      test:'./src/test.js'
  },
  devtool: 'cheap-module-eval-source-map',
  watch:true,
  watchOptions: {
    aggregateTimeout: 300,
    ignored: ['build/*', /node_modules/],
  },
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, 'build')
  }
};