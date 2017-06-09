import React from "react";
const _ = require('lodash')
import PropTypes from 'prop-types'

const isReady = () => typeof window !== 'undefined' && typeof window.grecaptcha !== 'undefined';

let readyCheck;

export default class Component extends React.Component {

  constructor(props) {
    super(props);
    this._renderGrecaptcha = this._renderGrecaptcha.bind(this);
    this.reset = this.reset.bind(this);
    this.state = {
      ready: isReady(),
      widget: null,
    };

    if (!this.state.ready) {
      readyCheck = setInterval(this._updateReadyState.bind(this), 1000);
    }
  }

  componentDidMount() {
    if (this.state.ready) {
      this._renderGrecaptcha();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {render, onloadCallback} = this.props;

    if (render === 'explicit' && onloadCallback && this.state.ready && !prevState.ready) {
      this._renderGrecaptcha();
    }
  }

  componentWillUnmount() {
    clearInterval(readyCheck);
  }

  reset() {
    const {ready, widget} = this.state;
    if (ready && widget !== null) {
      grecaptcha.reset(widget);
    }
  }

  _updateReadyState() {
    if (isReady()) {
      this.setState({
        ready: true,
      });

      clearInterval(readyCheck);
    }
  }

  _renderGrecaptcha() {
    this.state.widget = grecaptcha.render(this.props.elementID, {
      sitekey: this.props.sitekey,
      callback: (this.props.verifyCallback) ? this.props.verifyCallback : undefined,
      theme: this.props.theme,
      type: this.props.type,
      size: this.props.size,
      tabindex: this.props.tabindex,
      'expired-callback': (this.props.expiredCallback) ? this.props.expiredCallback : undefined,
    });

    this.props.onloadCallback();
  }

  render() {
    if (this.props.render === 'explicit' && this.props.onloadCallback) {
      return (
        <div id={this.props.elementID}
             data-onloadcallbackname={this.props.onloadCallbackName}
             data-verifycallbackname={this.props.verifyCallbackName}
        />
      );
    }

    return (
      <div className="g-recaptcha"
           data-sitekey={this.props.sitekey}
           data-theme={this.props.theme}
           data-type={this.props.type}
           data-size={this.props.size}
           data-tabindex={this.props.tabindex}
      />
    );
  }
}


Component.propTypes = {
  className: PropTypes.string,
  onloadCallbackName: PropTypes.string,
  elementID: PropTypes.string,
  onloadCallback: PropTypes.func,
  verifyCallback: PropTypes.func,
  expiredCallback: PropTypes.func,
  render: PropTypes.string,
  sitekey: PropTypes.string,
  theme: PropTypes.string,
  type: PropTypes.string,
  verifyCallbackName: PropTypes.string,
  expiredCallbackName: PropTypes.string,
  size: PropTypes.string,
  tabindex: PropTypes.string,
};

Component.defaultProps = {
  elementID: 'g-recaptcha',
  onloadCallback: undefined,
  onloadCallbackName: 'onloadCallback',
  verifyCallback: undefined,
  verifyCallbackName: 'verifyCallback',
  expiredCallback: undefined,
  expiredCallbackName: 'expiredCallback',
  render: 'onload',
  theme: 'light',
  type: 'image',
  size: 'normal',
  tabindex: '0',
};
