import React from "react";
import {connect} from "react-redux";
import {routeActions} from "redux-simple-router";
import {Link} from "react-router";
import PropTypes from 'prop-types'

const Item = (function () {
  const mapDispatchToProps = {
    handleClick: routeActions.push
  }
  const mapStateToProps = state => ({
    current: state.routing.location.pathname
  })
  return connect(mapStateToProps, mapDispatchToProps)(({key, label, route, current, handleClick}) => {
    const routesMatch = (r0, r1) => {
      const format = route => route == '/' ? route : route.trim('/').toLowerCase()
      return format(r0) == format(r1)
    }
    const liProps = routesMatch(route, current)
      ? {className: 'active'}
      : {};
    return <li key={key} {...liProps} onClick={() => handleClick(route)}><a href="javascript:;">{label}</a></li>
  })
})()

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false
    }
    this.toggleCollapse = () => this.setState({collapse: !this.state.collapse})
  }

  render() {
    const {user, handleLogout, children, search = null, items = []} = this.props
    const {collapse} = this.state
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top app-navbar">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    onClick={this.toggleCollapse}>
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <Link className="navbar-brand" to="/">
              [Y2Redux]
            </Link>
          </div>
          {collapse &&
          <div className="navbar-collapse collapse in" id="navbar-collapse-main" aria-expanded="true" style={{}}>
            <ul className="nav navbar-nav hidden-md hidden-lg">
              {items.map(props => <Item key={'a' + props.route} {...props}/>)}
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
            {items.map(props => <Item key={'a' + props.route} {...props}/>)}
          </ul>

          <ul className="nav navbar-nav navbar-right m-r-0 hidden-xs">
            {children}
          </ul>

          {search}

          <ul className="nav navbar-nav hidden-sm hidden-md hidden-lg">
            {items.map(props => <Item key={'small.' + props.route} {...props}/>)}
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
  items: []
}

Header.contextTypes = {
  store: PropTypes.object.isRequired
}

export default Header
