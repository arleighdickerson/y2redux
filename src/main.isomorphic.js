1+2
require("babel-core").transform("code", {
  presets: [
    "react",
    "node6-es6",
  ]
});
/*
 import React from "react";
const ReactDOMServer = require('react-dom/server');
import createStore from "./store/createStore";
import AppContainer from "./containers/AppContainer";
require('babel-register')()
import {match, createMemoryHistory} from "react-router";
import {createRoutes} from './routes'

const initialState = global.___INITIAL_STATE__
const history = createMemoryHistory(initialState.routing.location.pathname)
const store = createStore(history, initialState)
const routes = createRoutes(store)

// ========================================================
// Go!
// ========================================================
ReactDOMServer.renderToString(<AppContainer store={store} routes={routes} history={history}/>)
*/
