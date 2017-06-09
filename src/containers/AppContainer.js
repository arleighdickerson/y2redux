import React, {Component} from "react";
import {Provider} from "react-redux";
import {Router} from "react-router";
import PropTypes from 'prop-types'

export default class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    const {history, routes, store} = this.props
    return (
      <Provider store={store}>
        <Router history={history} children={routes}/>
      </Provider>
    )
  }
}
