// ------------------------------------
// Constants
// ------------------------------------
export const AUDIO_LOGIN = 'AUDIO_LOGIN'
export const AUDIO_CONNECT = 'AUDIO_CONNECT'
export const AUDIO_DISCONNECT = 'AUDIO_DISCONNECT'
export const AUDIO_ENABLE_MIC = 'AUDIO_ENABLE_MIC'

export const login = (username) => ({
  type: AUDIO_LOGIN,
  username
})

export function connect(username) {
  return {
    type: AUDIO_CONNECT,
    username
  }
}

export function disconnect() {
  return {
    type: AUDIO_DISCONNECT
  }
}

export function enableMic(enabled) {
  return {
    type: AUDIO_ENABLE_MIC,
    enabled
  }
}

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  connect,
  disconnect,
  enableMic,
  login
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [AUDIO_LOGIN]: (state, {username}) => {
    console.log(username)
    return ({...state, username})
  },
  [AUDIO_CONNECT]: (state, action) => ({...state}),
  [AUDIO_DISCONNECT]: (state, action) => ({...state}),
  [AUDIO_ENABLE_MIC]: (state, action) => ({...state}),
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {}

export default function audioReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
