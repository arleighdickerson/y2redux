import React, {Component} from 'react'
import PropTypes from 'prop-types'
const {EventEmitter} = require('events')
const _ = require('lodash')

const CLOSE_ALL = 'CLOSE_ALL'
const emitter = new EventEmitter()

export const closeAll = () => emitter.emit(CLOSE_ALL)

export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
    this._close = () => this.setState({open: false})
    this._handleClick = () => {
      const open = this.state.open
      closeAll()
      this.setState({open: !open})
    }
  }

  componentDidMount() {
    emitter.on(CLOSE_ALL, this._close)
  }

  componentWillUnmount() {
    emitter.removeListener(CLOSE_ALL, this._close)
  }

  render() {
    return (
      <li className={"dropdown" + (this.state.open ? ' open' : '')}>
        <a
          href="javascript:;"
          className="dropdown-toggle"
          role="button"
          aria-expanded={(this.state.open).toString()}
          onClick={() => this._handleClick()}
        >
          {this.props.label} <span className="caret"/>
        </a>
        <ul className="dropdown-menu">{this.props.children}</ul>
      </li>
    )
  }
}

Dropdown.propTypes = {
  label: PropTypes.string.isRequired
}
