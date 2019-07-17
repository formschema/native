import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

const DEST = 'dist';
const MODULE_NAME = 'FormSchema';

const BANNER = `/* ${pkg.name} v${pkg.version} (c) ${pkg.author} - ${pkg.license} */`;

const ResolvePlugin = resolve({
  browser: true
});

const ClosurePlugin = compiler();

const TerserPlugin = terser({
  compress: true,
  output: {
    comments: new RegExp(`^ ${pkg.name}`)
  },
  sourcemap: true
});

const ES6_PLUGINS = [
  ResolvePlugin,
  typescript({
    target: 'es6'
  }),
  ClosurePlugin,
  TerserPlugin
];

const ES5_PLUGINS = [
  ResolvePlugin,
  typescript({
    target: 'es5'
  }),
  ClosurePlugin,
  TerserPlugin
];

function build (format, suffix = format) {
  return {
    input: 'src/components/FormSchema.ts',
    cache: true,
    output: {
      file: `${DEST}/${MODULE_NAME}.${suffix}.min.js`,
      format,
      name: MODULE_NAME,
      indent: false,
      sourcemap: true,
      exports: 'named',
      banner: BANNER
    },
    plugins: format === 'es' ? ES6_PLUGINS : ES5_PLUGINS
  };
}

export default [
  build('es', 'esm'),
  build('amd'),
  build('cjs'),
  build('iife'),
  build('umd'),
  build('system')
];
