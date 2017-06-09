module.exports = name => require('../../secrets/' + name.replace('.', '/') + '.json')
