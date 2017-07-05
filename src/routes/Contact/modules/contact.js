import {send} from '../sources/contact'
import {change} from 'redux-form'
import {FORM_NAME} from '../components/ContactForm'

// ------------------------------------
// Constants
// ------------------------------------
export const CONTACT_FORM_SEND = 'CONTACT_FORM_SEND'

export function sendForm(attributes) {
  return dispatch => send(attributes)
    .then(() => dispatch({
      type: CONTACT_FORM_SEND,
      formData: attributes
    }))
}

export function setCaptcha(value = false) {
  return change(FORM_NAME, 'recaptcha', value)
}

export function resetCaptcha() {
  return dispatch => {
    dispatch(setCaptcha(true))
    dispatch(setCaptcha(false))
  }
}

// ------------------------------------
// Actions
// ------------------------------------
export const actions = {
  sendForm
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [CONTACT_FORM_SEND]: (state, action) => ({...state})
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialState = {}

export default function ContactReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
