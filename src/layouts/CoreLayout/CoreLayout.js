import React from "react";
import HeaderContainer from "../../containers/HeaderContainer";

const items = [
  {
    label: 'Home',
    route: '/'
  },
  {
    label: 'About',
    route: 'about'
  },
  {
    label: 'Counter',
    route: 'counter'
  },
  {
    label: 'Log In',
    route: 'login'
  }
]

const DEFAULT_AVATAR = require('../../static/img/avatar.gif')

const DEFAULT_SEARCH = (
  <form className="navbar-form navbar-right app-search" role="search">
    <form className="navbar-form navbar-right app-search" role="search">
      <div className="form-group">
        <input type="text" className="form-control" data-action="grow" placeholder="Search"/>
      </div>
    </form>

    <div className="form-group">
      <input type="text" className="form-control" data-action="grow" placeholder="Search"/>
    </div>
  </form>
)

export const CoreLayout = ({children}) => (
  <div className="with-top-navbar">
    <HeaderContainer {...{items}}>{/*
     <a className="app-notifications" href="notifications/index.html">
     <span className="icon icon-bell"/>
     </a>
     <button className="btn btn-default navbar-btn navbar-btn-avatar" data-toggle="popover">
     <img className="img-circle" src={DEFAULT_AVATAR}/><a href="javascript:;">adfasdf</a>
     </button>
     */}</HeaderContainer>
    <div className='container p-t-md'>
      {children}
    </div>
  </div>
)

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
}

export default CoreLayout
