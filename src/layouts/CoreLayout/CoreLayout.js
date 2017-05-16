import React from "react";
import HeaderContainer from "../../containers/HeaderContainer";
import {connect} from "react-redux";
import {logout} from "../../store/user"
import Growl from "../../components/Growl";
import PropTypes from 'prop-types'

const UserOptions = ({handleLogout}) => (
  <div
    id="user-options-popover"
    className="popover fade bottom in"
    role="tooltip"
    style={{top: '42px', left: '-169px', display: 'block'}}
  >
    <div className="arrow" style={{left: '91.4216%'}}/>
    <div className="popover-content p-x-0">
      <ul className="nav nav-stacked" style={{width: '200px'}}>
        <li><a href="javascript:;" onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
  </div>
)

const mapDispatchToProps = {
  handleLogout: logout
}

const mapStateToProps = ({user}) => ({user})

const DEFAULT_AVATAR = require('../../../public/img/avatar.gif')

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


class CoreLayout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showUserOptions: false
    }
    this.toggleUserOptions = () => this.setState({showUserOptions: !this.state.showUserOptions})
  }

  getItems(user) {
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
      }
    ];
    if (user) {
      //
    } else {
      items.push({
        label: 'Sign Up',
        route: 'signup'
      }, {
        label: 'Log In',
        route: 'login'
      })
    }
    return items
  }

  render() {
    const {children, user, handleLogout} = this.props

    return (
      <div className="with-top-navbar">
        <Growl/>
        <HeaderContainer avatar={DEFAULT_AVATAR} items={this.getItems(user)}>{/*
         <a className="app-notifications" href="notifications/index.html">
         <span className="icon icon-bell"/>
         </a>*/}
          {user &&
          <li>
            <a className="navbar-username" href="javascript:;" onClick={this.toggleUserOptions}>{user.username}</a>
          </li>
          }{user &&
          <li>
            <button className="btn btn-default navbar-btn navbar-btn-avatar" onClick={this.toggleUserOptions}>
              <img className="img-circle" src={DEFAULT_AVATAR}/>
            </button>
            {this.state.showUserOptions &&
            <UserOptions {...{handleLogout}}/>
            }
          </li>
          }

        </HeaderContainer>
        <div className='container p-t-md'>
          {children}
        </div>
      </div>
    )
  }
}

CoreLayout.propTypes = {
  children: PropTypes.element.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
