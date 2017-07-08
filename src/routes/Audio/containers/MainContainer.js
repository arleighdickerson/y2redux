import React from "react";
import {connect} from "react-redux";
import MainView from "../components/MainView";
import {actions} from "../modules/audio";

const mapDispatchToProps = ({
  connect: () => actions.connect(),
  disconnect: () => actions.disconnect(),
  beginRecording: () => actions.beginRecording(),
  endRecording: () => actions.endRecording(),
})


const mapStateToProps = (state) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(MainView)
