import React from "react";
import {Button} from "react-bootstrap";
const _ = require('lodash')

const wellStyles = {maxWidth: 400, margin: '0 auto 10px'};

export const MainView = ({users, connect, disconnect, beginRecording, endRecording, isConnected, isRecording}) => (
  <div>
    <h1>Main</h1>
    <div className="row">
      <div className="col-md-4">
        <Button bsSize="large" bsStyle="default" style={wellStyles} onClick={endRecording} block>End Recording</Button>
        <Button bsSize="large" bsStyle="default" style={wellStyles} onClick={beginRecording} block>Begin
          Recording</Button>
        <Button bsSize="large" bsStyle="default" style={wellStyles} onClick={disconnect} block>Disconnect</Button>
        <Button bsSize="large" bsStyle="default" style={wellStyles} onClick={connect} block>Connect</Button>
      </div>
      <div className="col-md-4">
        <ul>
        </ul>
      </div>
    </div>
  </div>
)

export default MainView
