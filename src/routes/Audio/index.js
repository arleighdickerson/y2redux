import React from "react";
import audioReducer from "./modules/audio";
import {injectReducer} from "../../store/reducers";
const _ = require('lodash')
const agent = require('../../util/agent')()

const inject = store => {
  injectReducer(store, {
    key: 'audio',
    reducer: audioReducer
  })
}

export const Login = (store) => ({
  path: 'audio/login',
  onEnter() {
    if (store.getState().audio === undefined) {
      global.location = '/audio'
      return
    }
    inject(store)
  },
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Component = require('./containers/LoginContainer').default
      cb(null, Component)
    }, 'audio-login')
  }
})

export const Main = (store) => ({
  path: 'audio',
  onEnter: (nextState, replace) => {
    if (store.getState().audio === undefined) {
      global.location = '/audio'
      return
    }
    inject(store)
    if (!!store.getState().audio.username) {
      return
    }
    replace('/audio/login')
  },
  getComponent(nextState, cb)
  {
    require.ensure([], (require) => {
      const Component = require('./containers/MainContainer').default
      cb(null, Component)
    }, 'audio')
  }
})
