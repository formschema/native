import { uglify } from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const DEST = 'dist'
const MODULE_NAME = 'FormSchema'

const BANNER = `/* ${pkg.name} v${pkg.version} (c) ${pkg.author} - ${pkg.license} */`

const PLUGINS = [
  resolve({
    jsnext: true,
    main: true,
    browser: true
  }),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    babelrc: false,
    presets: [
      [ '@babel/env', { modules: false } ]
    ]
  }),
  uglify({
    compress: true,
    output: {
      comments: new RegExp(`^ ${pkg.name}`)
    },
    sourceMap: true
  })
]

function build (format, suffix = `${format}.min`) {
  return {
    input: 'src/components/FormSchema.js',
    cache: false,
    output: {
      dir: DEST,
      file: `${MODULE_NAME}.${suffix}.js`,
      format,
      name: MODULE_NAME,
      indent: false,
      sourcemap: true,
      exports: 'named',
      banner: BANNER
    },
    plugins: format === 'es' ? [] : PLUGINS
  }
}

export default [
  build('amd'),
  build('cjs'),
  build('es', 'esm'),
  build('iife'),
  build('umd'),
  build('system')
]
