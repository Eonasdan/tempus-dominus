import typescript from '@rollup/plugin-typescript';
const pkg = require('../package.json');

export default {
  input: 'src/js/tempus-dominus.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'tempusDominus',
      //exports: 'named',
      sourcemap: true,
      globals: {
        '@popperjs/core': 'Popper'
      }
    },
    {
      file: pkg.module,
      format: 'es',
      name: 'tempusDominus',
      //exports: 'named',
      sourcemap: true,
      globals: {
        '@popperjs/core': 'Popper'
      }
    }
  ],
  external: ['@popperjs/core'],
  plugins: [typescript({
    declaration: true,
    declarationDir: "types"
  })]
};
