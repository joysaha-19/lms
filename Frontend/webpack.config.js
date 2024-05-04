const path = require('path');

module.exports = {
  entry: './src/index.js', // Replace 'index.js' with the entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Replace 'dist' with your desired output directory
    filename: 'bundle.js', // Replace 'bundle.js' with the name of the output bundle
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader', // Add this line to process CSS files with PostCSS
        ],
      },
    ],
  },
};
