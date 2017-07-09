import * as audio from "./audio";
import * as ctl from "./ctl";
import * as user from "./user";
import {runQueue} from "../../../util/promise";
const _ = require('lodash')

let _store = null

export function setStore(store) {
  _store = store
}

function getStore() {
  if (!_store) {
    throw new Error("no active session")
  }
  return _store
}

function getUsername(defaultTo = 'anon') {
  return _.get(getStore().getState(), 'audio.username', defaultTo)
}

function ensureConnection() {
  if (!isConnected()) {
    throw new Error("not connected to server")
  }
}

export function isConnected() {
  return audio.isConnected() && ctl.isConnected()
}

export function connect() {
  return runQueue([
    ctl.connect(getUsername()),
    audio.connect(getUsername())
  ])
}

export function disconnect(e) {
  audio.disconnect()
  ctl.disconnect()
  if (e !== undefined) {
    console.error(e)
  }
}

export function startRecording() {
  ensureConnection()
  return audio.startRecording()
}

export function stopRecording() {
  if (isConnected()) {
    return audio.stopRecording()
  }
}


export function getMeta() {
  return {
    channels: {
      ctl: ctl.getMeta(),
      data: audio.getMeta(),
    }
  }
}

export {user}
