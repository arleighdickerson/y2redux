const config = require('../config')
const IsomorphicTools = require('webpack-isomorphic-tools')

global.isomorphicTools = global.webpackIsomorphicTools = new IsomorphicTools(require('../build/isomorphic.config'))
  .server(config.path_base, function () {
    require('../server/renderer')
  })
