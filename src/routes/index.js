import React from "react";
import CoreLayout from "../layouts/CoreLayout";
import Home from "./Home";
import LoginRoute from "./Login";
import ContactRoute from "./Contact";
import ResetPasswordRoute from "./ResetPassword";
import SignupRoute from "./Signup";
import * as Skills from "./Skills";
import * as Progs from "./Progs";
import * as Audio from "./Audio";

const _ = require('lodash')

const DEFAULT_LAYOUT = ({children, ...props}) => {
  return (
    <CoreLayout {...props}>
      <div className="container p-t-md">
        {children}
      </div>
    </CoreLayout>
  )
}

const HOME_LAYOUT = ({children, ...props}) => (
  <CoreLayout {...props}>
    {children}
  </CoreLayout>
)

const LAYOUT_MAP = _.mapKeys({
  login: null,
  '': HOME_LAYOUT,
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
      LoginRoute(store),
      ContactRoute(store),
      ResetPasswordRoute(store),
      SignupRoute(store),
      Skills.Index(store),
      Skills.Detail(store),
      Progs.Index(store),
      Progs.Detail(store),
      Audio.Login(store),
      Audio.Main(store),
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
