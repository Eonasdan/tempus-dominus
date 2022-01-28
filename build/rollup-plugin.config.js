const typescript = require('rollup-plugin-typescript2');
const banner = require('./banner.js');
const globals = {
  '@popperjs/core': 'Popper',
  tempusDominus: 'tempusDominus'
};

module.exports = (config) => {
  const { input, fileName, name } = config
  return {
    input: {
      input,
      external: [
        'tempusDominus'
      ],
      plugins: [
        typescript({
          declaration: true,
          declarationDir: 'types'
        })
      ]
    },
    output: {
      banner,
      file: fileName,
      format: 'umd',
      name: name || 'tempusDominus',
      globals,
      compact: true
    }
  }
}