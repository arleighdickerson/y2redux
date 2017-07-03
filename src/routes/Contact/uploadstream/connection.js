const {BinaryClient} = require('./client')
const WebSocket = require('./ReconnectingWebSocket')

let clients = false

function handleAction(action) {
}

function getConnections(url) {
  if (clients === false) {
    const ws = new WebSocket(url, undefined, {
      automaticOpen: true,
      debug: true
    })
    ws.addEventListener('message', ({data}) => {
      try {
        const action = JSON.parse(data)
        handleAction(action)
      } catch (e) {
        // ign
      }
    })
    const client = new BinaryClient(ws)
    clients = {ws, client}
  }
  return clients
}

let promise = null
let dispatch = null

const acquire = function (store) {
  if (store) {
    dispatch = store.dispatch
  }
  if (promise === null) {
    promise = new Promise((resolve, reject) => {
      if (clients === false) {
        try {
          clients = getConnections('wss://' + location.host + '/ws')
        } catch (e) {
          reject(e)
        }
      }
      resolve(clients.client)
    })
  }
  return promise
}

module.exports = acquire
