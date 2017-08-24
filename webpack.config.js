const path = require('path');

module.exports = {
  entry: ['./app.js','./pages/index/index.js','./pages/logs/logs.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};