import React from "react";
import {Alert} from "react-bootstrap";
const EventEmitter = require('events').EventEmitter
const _ = require('lodash')

let counter = 0

const MESSAGE_ADDED = 'MessageAdded'

const emitter = new EventEmitter()

export default class Growl extends React.Component {
  static push(message) {
    emitter.emit(MESSAGE_ADDED, message)
  }

  constructor(props) {
    super(props)
    this.state = {
      notifications: []
    }

    this.receiveMessage = (message) => {
      const notifications = this.state.notifications.slice()
      notifications.push(message)
      this.setNotifications(notifications)
    }
  }

  componentDidMount() {
    emitter.on(MESSAGE_ADDED, this.receiveMessage)
  }

  componentWillUnmount() {
    emitter.removeListener(MESSAGE_ADDED, this.receiveMessage)
  }


  setNotifications(notifications) {
    this.setState({
      notifications: notifications.map(n => {
        if (typeof n == 'string') {
          n = {component: <p>{n}</p>}
        }
        const key = counter++
        const onDismiss = () => this.setNotifications(
          _.filter(this.state.notifications, n => n.key != key)
        )
        return {key, onDismiss, ...n}
      })
    })
  }

  render() {
    return (
      <div className="growl" id="app-growl">
        {this.state.notifications.map(props => <Message {...props}/>)}
      </div>
    )
  }
}

class Message extends React.Component {
  componentDidMount() {
    if (this.props.timeout) {
      const close = () => {
        this.props.onDismiss()
        this.timeout = null
      }
      this.timeout = window.setTimeout(close, this.props.timeout)
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      window.clearTimeout(this.timeout)
    }
  }

  render() {
    const {onDismiss, key, component, bsStyle = "dark"} = this.props
    return (
      <Alert {...{bsStyle, onDismiss, key}}>
        {component}
      </Alert>
    )
  }
}
