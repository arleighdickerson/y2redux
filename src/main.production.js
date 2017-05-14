import React from "react";
import ReactDOM from "react-dom";
import createStore from "./store/createStore";
import AppContainer from "./containers/AppContainer";
import {match, browserHistory as history} from "react-router";

const initialState = global.___INITIAL_STATE__
const store = createStore(history, initialState)
const routes = require('./routes/index').default(store)

const MOUNT_NODE = document.getElementById('root')

// ========================================================
// Go!
// ========================================================
match({history, routes}, (error, redirectLocation, renderProps) => {
  ReactDOM.render(
    <AppContainer
      store={store}
      routes={routes} history={history}
      userAgent={window.navigator.userAgent}
      renderProps={renderProps}/>,
    MOUNT_NODE
  )
})
