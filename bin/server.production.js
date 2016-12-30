const config = require('../config')
const IsomorphicTools = require('webpack-isomorphic-tools')

global.isomorphicTools = new IsomorphicTools({
  patch_require: true,
  debug: config.globals.__DEV__,
  assets: {}
}).server(config.path_base, function () {
  require('../server/renderer')
})
