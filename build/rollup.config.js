//const typescript = require('rollup-plugin-typescript2'); //this doesn't produce map files correctly ...sigh
const typescript = require('@rollup/plugin-typescript');
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";

const pkg = require('../package.json');
const banner = require('./banner.js');

const globals = {
  '@popperjs/core': 'Popper'
};

export default [
  {
    input: 'src/js/tempus-dominus.ts',
    output: [
      {
        banner,
        file: pkg.main,
        format: 'umd',
        name: 'tempusDominus',
        sourcemap: true,
        globals
      },
      {
        banner,
        file: pkg.module,
        format: 'es',
        name: 'tempusDominus',
        sourcemap: true,
        globals
      },
      {
        banner,
        file: `${pkg.main.replace('.js','')}.min.js`,
        format: 'umd',
        name: 'tempusDominus',
        globals, 
        plugins: [terser()]
      },
      {
        banner,
        file: `${pkg.module.replace('.js','')}.min.js`,
        format: 'es',
        name: 'tempusDominus',
        globals,
        plugins: [terser()]
      }
    ],
    external: ['@popperjs/core'],
    plugins: [
      typescript({
        declaration: true,
        declarationDir: 'types'
      })
    ]
  },
  {
    input: 'dist/js/jQuery-provider.js',
    output: [
      {
        file: 'dist/js/jQuery-provider.min.js',
      }
    ],
    plugins: [terser()]
  },
  {
    input: 'src/sass/tempus-dominus.scss',
    output: [
      {
        banner,
        file: 'dist/css/tempus-dominus.css'
      }
    ],
    plugins: [
      postcss({
        sourceMap: true,
        extract: true
      })
    ]
  },
  {
    input: 'src/sass/tempus-dominus.scss',
    output: [
      {
        banner,
        file: 'dist/css/tempus-dominus.min.css'
      }
    ],
    plugins: [
      postcss({
        extract: true,
        minimize: true
      })
    ]
  }
];
