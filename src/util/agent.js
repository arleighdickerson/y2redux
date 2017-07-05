const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']

module.exports = function () {
  const agent = require('superagent-use')(
    require('superagent-promise')(
      require('superagent'),
      Promise
    )
  )
  agent.use(request => {
    if (!SAFE_METHODS.includes(request.method)) {
      const send = Object.getPrototypeOf(request).send
      request.send = data => {
        const _csrf = document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute('content')
        return send.bind(request)({_csrf, ...data})
      }
    }
    return request.send({}).accept('json').type('json')
  })
  return agent
}

