'use strict'

const pkg = require('../package.json')
const year = new Date().getFullYear()

function getBanner() {
  return `/*!
  * Tempus Dominus v${pkg.version} (${pkg.homepage})
  * Copyright 2013-${year} ${pkg.author.name}
  * Licensed under MIT (https://github.com/Eonasdan/tempus-dominus/blob/master/LICENSE)
  */`
}

module.exports = getBanner
