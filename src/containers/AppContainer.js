import React, {Component, PropTypes} from "react";
import {Provider} from "react-redux";
import '../styles/fonts/toolkit-entypo.eot'
import '../styles/fonts/toolkit-entypo.ttf'
import '../styles/fonts/toolkit-entypo.woff'
import '../styles/fonts/toolkit-entypo.woff2'
import '../styles/toolkit.less'
import '../styles/application.less'
import {Router} from "react-router";
import 'open-sans-fontface'
import 'roboto-fontface'
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
