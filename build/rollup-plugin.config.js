const typescript = require('rollup-plugin-ts');
const ignore = require('rollup-plugin-ignore');

const banner = require('./banner.js');
const globals = {
  '@popperjs/core': 'Popper',
  tempusDominus: 'tempusDominus'
};

module.exports = (config) => {
  const { input, fileName, name } = config;
  return {
    input: {
      input,
      external: [
        'tempusDominus'
      ],
      plugins: [
        ignore(['DateTime', 'ErrorMessages']),
        typescript({
          tsconfig: resolvedConfig => ({ ...resolvedConfig, declaration: false, rootDir: "./src" })
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
  };
};
