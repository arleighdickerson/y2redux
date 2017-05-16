import React from "react";
import {connect} from "react-redux";
import Header from "../components/Header";
import {logout} from "../store/user";

const mapDispatchToProps = {handleLogout: logout}

const mapStateToProps = ({user}) => ({user})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
