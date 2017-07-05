const _ = require('lodash')
const transformArray = array => _.isArray(array[1])
  ? {label: array[0], children: array[1].map(transformArray)}
  : {label: array[0], route: '/' + array[1].trim('/')}

function getItems(forUser) {
  const items = [
    ['Home', '/'],
    ['Contact', 'contact'],
    ['Skills', [
      ['NodeJS', 'skills/nodejs'],
      ['ReactJS/Flux', 'skills/reactjs'],
      ['Yii2/PHP', 'skills/yii2php'],
      ['MySQL', 'skills/mysql'],
    ]],
    ['Progs', [
      ['Y2Redux', 'progs/y2redux'],
      ['React/Redux/Express Boilerplate', 'progs/react-redux-express'],
      ['Yii2 MySQL XA Transactions', 'progs/xa']
    ]],
    ['Demos', [
      ['Ratchet Stream', 'audio'],
    ]]
  ];
  return items
}

export default function (forUser) {
  return getItems(forUser).map(transformArray)
}
