const path = require('path');

module.exports = {
  devServer: {
    contentBase: [
      path.join(__dirname, 'public'),
      path.join(__dirname, '../dist')
    ]
  },
  configureWebpack: {
    resolve: {
      modules: [
        'node_modules',
        path.join(__dirname, '../dist')
      ]
    }
  }
};
