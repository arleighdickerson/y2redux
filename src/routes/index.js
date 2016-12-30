// We only need to import the modules necessary for initial render
import CoreLayout from "../layouts/CoreLayout";
import Home from "./Home";
import AboutRoute from "./About";
import CounterRoute from "./Counter";
import LoginRoute from "./Login";
import ContactRoute from "./Contact";
import ResetPasswordRoute from "./ResetPassword";
const _ = require('lodash')

const DEFAULT_LAYOUT = CoreLayout
const LAYOUT_MAP = _.mapKeys({
  login: null
}, (layout, path) => '/' + path);

export const createRoutes = (store) => {
  return {
    path: '/',
    getComponent(nextState, cb){
      const pathname = nextState.location.pathname
      const path = pathname.startsWith('/') ? pathname : '/' + pathname
      const Layout = LAYOUT_MAP[path] === undefined ? DEFAULT_LAYOUT : LAYOUT_MAP[path]
      cb(null, Layout)
    },
    indexRoute: Home(store),
    childRoutes: [
      AboutRoute(store),
      CounterRoute(store),
      LoginRoute(store),
      ContactRoute(store),
      ResetPasswordRoute(store),
    ]
  }
}

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
 using getChildRoutes with the following signature:

 getChildRoutes (location, cb) {
 require.ensure([], (require) => {
 cb(null, [
 // Remove imports!
 require('./Counter').default(store)
 ])
 })
 }

 However, this is not necessary for code-splitting! It simply provides
 an API for async route definitions. Your code splitting should occur
 inside the route `getComponent` function, since it is only invoked
 when the route exists and matches.
 */

export default createRoutes
