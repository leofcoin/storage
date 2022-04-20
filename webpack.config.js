const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: './src/level.js',
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
  //   new webpack.ProvidePlugin({
  //       Buffer: ['buffer', 'Buffer'],
  //   }),
    new webpack.ProvidePlugin({
        process: 'process/browser',
  })
  ],
  optimization: {
    minimize: false
  },
  resolve: {
    // extensions: [ '.ts', '.js' ],
    fallback: {
      // "stream": require.resolve("stream-browserify"),
      // "buffer": require.resolve("buffer"),
      "fs": false,
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "os": require.resolve("os-browserify")
    }
  },
  output: {
    library: {
      name: 'LeofcoinStorage',
      type: 'global'
    },
    filename: 'browser.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
