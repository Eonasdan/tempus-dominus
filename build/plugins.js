const rollup = require('rollup')
const genericRollup = require('./rollup-plugin.config')
const fs = require('fs')
const util = require('util')
const path = require('path')

const { promisify } = util

const promisifyReadDir = promisify(fs.readdir)
const promisifyReadFile = promisify(fs.readFile)
const promisifyWriteFile = promisify(fs.writeFile)

const localeNameRegex = /\/\/ (.*) \[/
const formatName = n => n.replace(/\.ts/, '').replace(/-/g, '_')

const localePath = path.join(__dirname, '../src/locales')

async function build(option) {
  const bundle = await rollup.rollup(option.input)
  await bundle.write(option.output)
}

async function listLocaleJson(localeArr) {
  const localeListArr = []
  await Promise.all(localeArr.map(async (l) => {
    const localeData = await promisifyReadFile(path.join(localePath, l), 'utf-8')
    localeListArr.push({
      key: l.slice(0, -3),
      name: localeData.match(localeNameRegex)[1]
    })
  }))
  promisifyWriteFile(path.join(__dirname, '../locales.json'), JSON.stringify(localeListArr), 'utf8')
}

(async () => {
  try {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    // We use await-in-loop to make rollup run sequentially to save on RAM
    const locales = await promisifyReadDir(localePath)
    for (const l of locales) {
      // run builds sequentially to limit RAM usage
      await build(genericRollup({
        input: `./src/locales/${l}`,
        fileName: `./dist/locales/${l.replace('.ts', '.js')}`,
        name: `tempusDominus.locales.${formatName(l)}`
      }))
    }

    const plugins = await promisifyReadDir(path.join(__dirname, '../src/plugins'))
    for (const plugin of plugins.filter(x => x !== 'examples')) {
      // run builds sequentially to limit RAM usage
      await build(genericRollup({
        input: `./src/plugins/${plugin}/index.ts`,
        fileName: `./dist/plugins/${plugin}.js`,
        name: `tempusDominus.plugins.${formatName(plugin)}`
      }))
    }

    const examplePlugins = await promisifyReadDir(path.join(__dirname, '../src/plugins/examples'))
    for (const plugin of examplePlugins.map(x => x.replace('.ts', ''))) {
      // run builds sequentially to limit RAM usage
      await build(genericRollup({
        input: `./src/plugins/examples/${plugin}.ts`,
        fileName: `./dist/plugins/examples/${plugin}.js`,
        name: `tempusDominus.plugins.${formatName(plugin)}`
      }))
    }

   /* build(configFactory({
      input: './src/index.js',
      fileName: './tempusDominus.min.js'
    }))*/

    //await promisify(ncp)('./types/', './')

    // list locales
   // await listLocaleJson(locales)
  } catch (e) {
    console.error(e) // eslint-disable-line no-console
  }
})()
