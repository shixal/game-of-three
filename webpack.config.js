const path = require('path');

module.exports = {
  entry: './src/client/client.ts',  // Entry point of your application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',  // Can be 'production' for optimized code
  devtool: 'inline-source-map',
};
