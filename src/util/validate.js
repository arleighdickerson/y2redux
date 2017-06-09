const validatejs = require('validate.js');
const _ = require('lodash');
module.exports = function (constraints) {
  return attributes => {
    return _.mapValues(validatejs(attributes, constraints), error => error[0]);
  }
}
