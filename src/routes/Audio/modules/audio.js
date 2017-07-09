import * as sources from "../sources";
// ------------------------------------
// Constants
// ------------------------------------
export const AUDIO_LOGIN = 'AUDIO_LOGIN'
export const AUDIO_CONNECT = 'AUDIO_CONNECT'
export const AUDIO_DISCONNECT = 'AUDIO_DISCONNECT'
export const AUDIO_BEGIN_RECORDING = 'AUDIO_BEGIN_RECORDING'
export const AUDIO_END_RECORDING = 'AUDIO_END_RECORDING'

const login = username => dispatch => sources.user.login(username).then(() => {
  dispatch({
    type: AUDIO_LOGIN,
    username
  })
})

function connect() {
  return {
    type: AUDIO_CONNECT,
    payload: sources.connect(),
    meta: sources.getMeta()
  }
}

function disconnect() {
  return dispatch => {
    sources.disconnect();
    dispatch({
      type: AUDIO_DISCONNECT,
      meta: sources.getMeta()
    })
  }
}

function beginRecording() {
  return dispatch => {
    dispatch({type: 'AUDIO_BEGIN_RECORDING_PENDING'})
    try {
      sources.startRecording()
      dispatch({
        type: 'AUDIO_BEGIN_RECORDING_FULFILLED',
        meta: sources.getMeta()
      })
    }
    catch (e) {
      dispatch({
        type: 'AUDIO_BEGIN_RECORDING_REJECTED',
        error: true,
        meta: {...sources.getMeta(), exception: e}
      })
    }
  }
}

function endRecording() {
  return dispatch => {
    sources.stopRecording()
    dispatch({
      type: AUDIO_END_RECORDING
    })
  }
}

// ------------------------------------
// Actions
// ------------------------------------

export const actions = {
  connect,
  disconnect,
  beginRecording,
  endRecording,
  login
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [AUDIO_LOGIN]: (state, {username}) => ({...state, username}),
  ['AUDIO_CONNECT_FULFILLED']: (state, {username}) => ({...state, isConnected: true}),
  ['AUDIO_CONNECT_REJECTED']: (state, action) => ({...state, isConnected: false}),
  [AUDIO_DISCONNECT]: (state, action) => ({...state, isConnected: false}),
  ['AUDIO_BEGIN_RECORDING_FULFILLED']: (state, action) => ({...state, isRecording: true}),
  ['AUDIO_BEGIN_RECORDING_REJECTED']: (state, action) => ({...state, isRecording: false}),
  [AUDIO_END_RECORDING]: (state, action) => ({...state, isRecording: false}),
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {
  username: null,
  isConnected: false,
  isRecording: false,
  users: [],
}

export default function audioReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
