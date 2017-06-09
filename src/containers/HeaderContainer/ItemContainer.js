import React from "react";
import {connect} from "react-redux";
import {routeActions} from "redux-simple-router";
import Item from "../../components/Header/Item";

const mapDispatchToProps = {
  handleClick: path => routeActions.push(path.replace('//', '/'))
}
const mapStateToProps = (state, ownProps) => ({
  current: state.routing.location.pathname,
  ...ownProps
})

export default connect(mapStateToProps, mapDispatchToProps)(Item)
