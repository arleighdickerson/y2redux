import React from "react";
import {connect} from "react-redux";
import {Header as HeaderComponent} from "../../components/Header";
import {logout} from "../../store/user";

const mapDispatchToProps = {handleLogout: logout}

const mapStateToProps = ({user}) => ({user})

export const Header = connect(mapStateToProps, mapDispatchToProps)(HeaderComponent)

export default Header
