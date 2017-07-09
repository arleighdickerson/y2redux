import {reducer as formReducer} from "redux-form";
import {combineReducers} from "redux";
import {routeReducer} from "redux-simple-router";
import userReducer from "./user";
import audioReducer from "../routes/Audio/modules/audio";

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    form: formReducer,
    routing: routeReducer,
    user: userReducer,
    audio: audioReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, {key, reducer}) => {
  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
