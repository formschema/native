// require all test files using special Webpack feature
// https://webpack.github.io/docs/context.html#require-context
var testsContext = require.context('.', true, /\.spec\.js$/)
testsContext.keys().forEach(testsContext)

// var componentsContext = require.context('../components', true)
// testsContext.keys().forEach(componentsContext)
