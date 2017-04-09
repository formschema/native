var webpackConfig = require('./webpack.config.js')

delete webpackConfig.entry

module.exports = function (config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    // this is the entry file for all our tests.
    files: ['test/index.js'],
    reporters: ['spec'],
    // we will pass the entry file to webpack for bundling.
    preprocessors: {
      'test/index.js': ['webpack']
    },
    // use the webpack config
    webpack: webpackConfig,
    // avoid walls of useless text
    loaders: [
      {
        test: /.vue$/,
        loader: 'vue!eslint'
      }
    ],
    webpackMiddleware: {
      noInfo: true
    },
    singleRun: true
  })
}
