import React from "react";
import ReactDOM from "react-dom";
import createStore from "./store/createStore";
import AppContainer from "./containers/AppContainer";
import {browserHistory as history} from "react-router";

// =======================================================
// Store Instantiation
// ========================================================
const initialState = global.___INITIAL_STATE__
const store = createStore(history, initialState)

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const routes = require('./routes/index').default(store) //<-- NEEDS to be inside render function
  ReactDOM.render(
    <AppContainer
      store={store}
      routes={routes} history={history}
      userAgent={window.navigator.userAgent}
    />,
    MOUNT_NODE
  )
}

if (module.hot) {
  // Development render functions
  const renderApp = render
  const renderError = (error) => {
    const RedBox = require('redbox-react').default
    ReactDOM.render(<RedBox error={error}/>, MOUNT_NODE)
  }

  // Wrap render in try/catch
  render = () => {
    try {
      renderApp()
    } catch (error) {
      renderError(error)
    }
  }

  // Setup hot module replacement
  module.hot.accept('./routes/index', () =>
    setImmediate(() => {
      ReactDOM.unmountComponentAtNode(MOUNT_NODE)
      render()
    })
  )
}

// ========================================================
// Go!
// ========================================================
render()
