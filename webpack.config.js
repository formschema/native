var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: path.resolve(__dirname, 'component.vue'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'vue-json-schema.js',
    libraryTarget: 'umd',
    library: 'vue-json-schema',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin( {
      minimize : true,
      sourceMap : false,
      mangle: true,
      compress: {
        warnings: false
      }
    })
  ],
  externals: {
    '@vx-components/input': '@vx-components/input',
    '@vx-components/select': '@vx-components/select',
    '@vx-components/textarea': '@vx-components/textarea',
    '@vx-components/fileinput': '@vx-components/fileinput',
    '@vx-components/checkbox': '@vx-components/checkbox'
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
