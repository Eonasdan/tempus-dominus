const rollup = require('rollup');
const genericRollup = require('./rollup-plugin.config');
const fs = require('fs').promises;
const path = require('path');

const formatName = (n) => n.replace(/\.ts/, '').replace(/-/g, '_');

const localePath = path.join(__dirname, '../src/js/locales');

async function build(option) {
  const bundle = await rollup.rollup(option.input);
  await bundle.write(option.output);
}

async function locales() {
  console.log('Building Locales...');
  try {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    // We use await-in-loop to make rollup run sequentially to save on RAM
    const locales = await fs.readdir(localePath);
    for (const l of locales.filter((x) => x.endsWith('.ts'))) {
      // run builds sequentially to limit RAM usage
      await build(
        genericRollup({
          input: `./src/js/locales/${l}`,
          fileName: `./dist/locales/${l.replace('.ts', '.js')}`,
          name: `tempusDominus.locales.${formatName(l)}`,
          kind: 'locales',
        })
      );
    }
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}

async function plugins() {
  console.log('Building Plugins...');
  try {
    const plugins = await fs.readdir(path.join(__dirname, '../src/js/plugins'));
    for (const plugin of plugins.filter((x) => x !== 'examples')) {
      // run builds sequentially to limit RAM usage
      await build(
        genericRollup({
          input: `./src/js/plugins/${plugin}/index.ts`,
          fileName: `./dist/plugins/${plugin}.js`,
          name: `tempusDominus.plugins.${formatName(plugin)}`,
          kind: 'plugins',
        })
      );
    }

    const examplePlugins = await fs.readdir(
      path.join(__dirname, '../src/js/plugins/examples')
    );
    for (const plugin of examplePlugins.map((x) => x.replace('.ts', ''))) {
      // run builds sequentially to limit RAM usage
      await build(
        genericRollup({
          input: `./src/js/plugins/examples/${plugin}.ts`,
          fileName: `./dist/plugins/examples/${plugin}.js`,
          name: `tempusDominus.plugins.${formatName(plugin)}`,
        })
      );
    }
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
  }
}

const args = process.argv.slice(2);

let command = 'all';

if (args.length !== 0) command = args[0];

switch (command) {
  case '-p':
    plugins().then();
    break;
  case '-l':
    locales().then();
    break;
  case 'all':
    plugins().then(() => locales().then());
    break;
}
