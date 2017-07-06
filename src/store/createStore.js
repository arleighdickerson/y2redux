import {applyMiddleware, compose, createStore} from "redux";
import thunk from "redux-thunk";
import makeRootReducer from "./reducers";
import {syncHistory} from "redux-simple-router";

export default (history, initialState = {}) => {
  const routerMiddleware = syncHistory(history)
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [
    routerMiddleware,
    thunk
  ]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = []
  if (__DEV__) {
    const devToolsExtension = global.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )

  routerMiddleware.listenForReplays(store)

  store.asyncReducers = {}

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default
      store.replaceReducer(reducers(store.asyncReducers))
    })
  }

  return store
}

