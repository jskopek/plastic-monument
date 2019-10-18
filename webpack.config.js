const path = require('path');

module.exports = {
  entry: './js/code.js',
  output: {
    path: path.resolve(__dirname, 'js', 'dist'),
    filename: 'bundle.js'
  }
};
