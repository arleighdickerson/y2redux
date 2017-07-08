global.AUTOBAHN_DEBUG = true

const autobahn = require('autobahn');

let _username = null
let _conn = null
let _session = global._session = null

function setConnection(conn) {
  _conn = global._conn = conn
}

function setSession(session) {
  _session = global._session = session
}

function getSession() {
  if (!_session) {
    throw new Error("no active session")
  }
  return _session
}

export function publish(type, payload = {}) {
  getSession().publish(type, [], payload)
}

export function subscribe(type, handler) {
  return getSession().subscribe(type, handler)
}

export function call(name, ...args) {
  return getSession().call(name, args)
}

export function isConnected() {
  return _conn !== null && _conn.isConnected
}

export function connect(username) {
  _username = username
  disconnect()
  return new Promise((resolve, reject) => {
    const url = 'wss://' + location.host + '/ws/audio/ctl' + (username ? '?' + username : '')
    const connection = new autobahn.Connection({
      url,
      type: 'websocket',
      realm: 'realm1'
    })
    connection.onopen = (session, details) => {
      setConnection(connection)
      setSession(session)
      resolve({connection, session, details})
    }
    connection.onclose = (reason, details) => {
      disconnect()
      reject({reason, details})
    }
    connection.open()
  })
}

export function disconnect() {
  if (isConnected()) {
    _conn.close()
  }
  _conn = null
  _session = null
  _username = null
}

export function getMeta(){
  return {
  }
}