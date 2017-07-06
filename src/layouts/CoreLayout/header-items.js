const _ = require('lodash')
const transformArray = array => _.isArray(array[1])
  ? {label: array[0], children: array[1].map(transformArray)}
  : {label: array[0], route: '/' + array[1].trim('/')}

function getItems(forUser) {
  const items = [
    ['Home', '/'],
    ['Skills', [
      ['NodeJS', 'skills/nodejs'],
      ['ReactJS/Flux', 'skills/reactjs'],
      ['Yii2/PHP', 'skills/yii2php'],
      ['MySQL', 'skills/mysql'],
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
