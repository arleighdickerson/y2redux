import {reducer as formReducer} from "redux-form";
import {combineReducers} from "redux";
import {routeReducer} from "redux-simple-router";
import userReducer from './user'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    form: formReducer,
    routing: routeReducer,
    user:userReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
