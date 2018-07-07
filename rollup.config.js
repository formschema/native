import babel from 'rollup-plugin-babel'

const DEST = 'dist'
const MODULE_NAME = 'FormSchema'

function output (format, suffix = format) {
  return {
    file: `${DEST}/${MODULE_NAME}.${suffix}.js`,
    format: format,
    name: MODULE_NAME,
    indent: false,
    sourcemap: true
  }
}

export default {
  input: 'src/components/FormSchema.js',
  output: [
    output('amd'),
    output('cjs'),
    output('es', 'esm'),
    output('iife'),
    output('umd'),
    output('system')
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['@babel/env', { modules: false }]]
    })
  ]
}
