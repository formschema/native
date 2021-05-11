import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import pkg from './package.json';

const DEST = 'dist';
const MODULE_NAME = 'FormSchema';

const BANNER = `/* ${pkg.name} v${pkg.version} (c) ${pkg.author} - ${pkg.license} */`;

const ResolvePlugin = resolve({
  browser: true
});

const TerserPlugin = terser({
  compress: true,
  output: {
    comments: new RegExp(`^ ${pkg.name}`)
  }
});

const CopyPlugin = copy({
  targets: [
    { src: 'src/types/**/*', dest: 'dist/types' }
  ]
});

const ES6_PLUGINS = [
  ResolvePlugin,
  typescript({
    target: 'es6'
  }),
  TerserPlugin,
  CopyPlugin
];

const ES5_PLUGINS = [
  ResolvePlugin,
  typescript({
    target: 'es5'
  }),
  TerserPlugin,
  CopyPlugin
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
