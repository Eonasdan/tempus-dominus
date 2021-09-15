import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';

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
  }
  /*{
    input: 'src/sass/tempus-dominus.scss',
    output: {
      banner,
      file: 'dist/css/tempus-dominus.min.css'
    },
    plugins: [
      postcss({
        extract: true,
        minimize: true
      })
    ]
  }*/
];
