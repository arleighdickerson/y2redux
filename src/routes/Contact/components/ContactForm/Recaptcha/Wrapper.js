import React from "react";
import PropTypes from "prop-types";
import {getFormValues} from "redux-form";
import Component from './Component'
const _ = require('lodash')

const stylez = {}

export default class Wrapper extends React.Component {
  constructor(props) {
    super(props)
    this._recaptcha = null
    this._unsubscribe = null
  }

  componentDidMount() {
    const store = this.context.store
    this._unsubscribe = store.subscribe(this.listen(store))
  }

  componentWillUnmount() {
    if (this._unsubscribe !== null) {
      this._unsubscribe()
    }
  }

  render() {
    return (
      <Component {...this.props} style={stylez}/>
    )
  }

  _reset() {
    if (this._recaptcha === null) {
      this._recaptcha.reset()
    }
  }

  listen(store) {
    let currentValue
    return () => {
      let previousValue = currentValue
      currentValue = this.select(store.getState())
      if (previousValue !== currentValue) {
        this.onChange(previousValue, currentValue)
      }
    }
  }

  onChange(prev, next) {
    if (prev && !next) {
      this._reset()
    }
  }

  select(state) {
    return _.defaultTo(
      getFormValues(this.props.form)(state), {[this.props.attribute]: false}
    )[this.props.attribute]
  }
}

Wrapper.defaultProps = {
  currentValue: false
}

Wrapper.propTypes = {
  form: PropTypes.string.isRequired,
  attribute: PropTypes.string.isRequired,
}

Wrapper.contextTypes = {
  store: PropTypes.object
}

