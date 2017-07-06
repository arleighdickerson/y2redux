const agent = require('../../../util/agent')()

export const login = username => agent.post('/audio/login').then(({body}) => body)
