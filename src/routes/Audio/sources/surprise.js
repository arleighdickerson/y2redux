const agent = require('../../../util/agent')()

export const getRandomUsername = () => agent.get('/audio/surprise').then(({body}) => body)
