'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  devServer: {
    proxy: 'http://localhost:3000'
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'source-map'
    }
    config.resolve = {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src'),
        'api': resolve('src/api'),
        'base': resolve('src/base'),
        'common': resolve('src/common'),
        'components': resolve('src/components'),
        'page': resolve('src/page')
      }
    }
  }
}
