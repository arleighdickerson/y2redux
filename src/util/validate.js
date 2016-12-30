const validatejs = require('validate.js');
const _ = require('lodash');
module.exports = function (constraints) {
    return attributes => _.map(validatejs(attributes, constraints), error=>error[0]);
}
