module.exports = name => require('../../secrets/' + name.split('.').join('/') + '.json')
