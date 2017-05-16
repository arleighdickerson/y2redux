export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_SIGNUP = 'USER_SIGNUP'

import * as source from "../sources/authentication";

export function logout() {
  return dispatch => source.logout()
    .then(() => dispatch({
      type: USER_LOGOUT,
      payload: null,
      meta: {
        transition: (prevState, nextState, action) => ({
          pathname: '/',
        }),
      }
    }))
}

export function login(username, password) {
  return dispatch => source.login(username, password)
    .then(payload => dispatch({
      type: USER_LOGIN,
      payload,
      meta: {
        transition: (prevState, nextState, action) => ({
          pathname: '/'
        }),
      }
    }))
}

export function signup(attributes) {
  return dispatch => source.signup(attributes)
    .then(payload => dispatch({
      type: USER_SIGNUP,
      payload: attributes,
      meta: {
        transition: (prevState, nextState, action) => ({
          pathname: '/'
        }),
      }
    }))
}

export const actions = {
  login,
  logout,
  signup
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [USER_LOGIN]: (state, {payload}) => {
    return payload
  },
  [USER_LOGOUT]: () => {
    return null
  },
  [USER_SIGNUP]: (state,{payload}) => {
    return payload
  },
}

const initialState = null
export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}

