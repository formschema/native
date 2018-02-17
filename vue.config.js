const path = require('path')

module.exports = {
  lintOnSave: true,
  configureWebpack: {
    entry: path.join(__dirname, 'src/components/FormSchema.js'),
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'FormSchema.js',
      libraryTarget: 'umd',
      library: 'FormSchema',
      umdNamedDefine: true
    },
    externals: {
      'vue': 'vue'
    }
  }
}
