export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

import * as source from "../sources/Authentication";

export function logout() {
  return dispatch => source.logout()
    .then(() => dispatch({
      type: LOGOUT_SUCCESS,
      payload: null,
      meta: {
        transition: (prevState, nextState, action) => ({
          pathname: '/',
        }),
      }
    }))
    .catch(() => dispatch({
      type: LOGOUT_FAILURE,
      payload: null,
    }))
}

export function login(username, password) {
  return dispatch => source.login(username, password)
    .then(payload => dispatch({
      type: LOGIN_SUCCESS,
      payload,
      meta: {
        transition: (prevState, nextState, action) => ({
          pathname: '/'
        }),
      }
    }))
    .catch(() => dispatch({
      type: LOGIN_FAILURE,
      payload: null,
    }))
}

export const actions = {
  login,
  logout
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [LOGIN_SUCCESS]: (state, {payload}) => {
    return payload
  },
  [LOGIN_FAILURE]: () => {
    return null
  },
  [LOGOUT_SUCCESS]: () => {
    return null
  },
  [LOGOUT_FAILURE]: state => {
    return state
  }
}

const initialState = null
export default function userReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
