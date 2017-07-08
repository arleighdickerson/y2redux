const agent = require('../../../util/agent')()
export const getRandomUsername = () => agent.get('/audio/surprise').then(({body}) => body)
export const login = username => agent.post('/audio/login').send({username})
