import React from "react";
import {connect} from "react-redux";
import {routeActions} from "redux-simple-router";
import {Link} from "react-router";

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
    return <li key={key} {...liProps} onClick={()=>handleClick(route)}><a href="javascript:;">{label}</a></li>
  })
})()

export const Header = ({search = null, items = [], children = []}) => {
  items.map(props => <Item key={props.route} {...props}/>)
  return (
    <nav className="navbar navbar-inverse navbar-fixed-top app-navbar">
      <div className="container">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#navbar-collapse-main">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
          <Link className="navbar-brand" to="/" style={{fontFamily:'Roboto-Bold'}}>
            {/*<img src={require('../../static/img/brand-white.png')} alt="brand"/>*/}
            [Y2Redux]
          </Link>
        </div>
        <div className="navbar-collapse collapse" id="navbar-collapse-main">
          <ul className="nav navbar-nav hidden-xs">
            {items.map(props => <Item key={'a'+props.route} {...props}/>)}
          </ul>

          <ul className="nav navbar-nav navbar-right m-r-0 hidden-xs">
            {(function () {
              let i = 0;
              return children.map(child => <li key={i++}>{child}</li>)
            })()}
          </ul>

          {search}

          <ul className="nav navbar-nav hidden-sm hidden-md hidden-lg">
            {items.map(props => <Item key={'small.'+props.route} {...props}/>)}
          </ul>

          <ul className="nav navbar-nav hidden">
            <li><a href="#" data-action="growl">Growl</a></li>
            <li><a href="login/index.html">Logout</a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

Header.defaultProps = {
  items: []
}

Header.contextTypes = {
  store: React.PropTypes.object.isRequired
}

export default Header
