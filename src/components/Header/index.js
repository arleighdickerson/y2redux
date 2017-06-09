import React, {Component} from "react";
import {Link} from "react-router";
import PropTypes from "prop-types";
import Item from "../../containers/HeaderContainer/ItemContainer";
import Dropdown from "./Dropdown"
const _ = require('lodash')

const renderSingle = props => <Item key={'a' + props.route} {...props}/>
const renderDropdown = (()=>{
  let k = 0
  return ({label, children}) => (
    <Dropdown key={k++} label={label}>{children.map(renderSingle)}</Dropdown>
  )
})()
const renderItem = item => _.isUndefined(item.children)
  ? renderSingle(item)
  : renderDropdown(item)

export class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false
    }
    this._toggleCollapse = () => this.setState({collapse: !this.state.collapse})
  }

  render() {
    const {brand, user, handleLogout, children, search = null, items = []} = this.props
    const {collapse} = this.state
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top app-navbar">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    onClick={this._toggleCollapse}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <Link className="navbar-brand" to="/">
              {brand}
            </Link>
          </div>
          {collapse &&
          <div className="navbar-collapse collapse in" id="navbar-collapse-main" aria-expanded="true" style={{}}>
            <ul className="nav navbar-nav hidden-md hidden-lg">
              {items.map(renderItem)}
              {user &&
              <li>
                <a href="javascript:;" onClick={handleLogout}>Logout</a>
              </li>
              }
            </ul>
          </div>
          }{!collapse &&
        <div className="navbar-collapse collapse" id="navbar-collapse-main">
          <ul className="nav navbar-nav hidden-xs">
            {items.map(renderItem)}
          </ul>
          <ul className="nav navbar-nav navbar-right m-r-0 hidden-xs">
            {children}
          </ul>
          {search}
          <ul className="nav navbar-nav hidden-sm hidden-md hidden-lg">
            {items.map(renderItem)}
          </ul>

          <ul className="nav navbar-nav hidden">
            <li><a href="#" data-action="growl">Growl</a></li>
            <li><a href="login/index.html">Logout</a></li>
          </ul>
        </div>
        }
        </div>
      </nav>
    )
  }
}

Header.defaultProps = {
  items: [],
  brand: '[Y2Redux]'
}

Header.contextTypes = {
  store: PropTypes.object.isRequired
}

export default Header
