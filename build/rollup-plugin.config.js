const typescript = require('rollup-plugin-ts');
const ignore = require('rollup-plugin-ignore');

const banner = require('./banner.js');
const globals = {
  '@popperjs/core': 'Popper',
  tempusDominus: 'tempusDominus',
};

module.exports = (config) => {
  const { input, fileName, name, kind } = config;
  return {
    input: {
      input,
      external: ['tempusDominus'],
      plugins: [
        ignore(['DateTime', 'ErrorMessages', 'FormatLocalization']),
        typescript({
          tsconfig: (resolvedConfig) => ({
            ...resolvedConfig,
            declaration: kind !== undefined,
            declarationDir: `./types/${kind}`,
          }),
        }),
      ],
    },
    output: {
      banner,
      file: fileName,
      format: 'umd',
      name: name || 'tempusDominus',
      globals,
      compact: true,
    },
  };
};
