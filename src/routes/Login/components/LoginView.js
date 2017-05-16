import React from "react";
import {Link} from "react-router";
export const LoginView = (props) => (
  <div className="container-fluid container-fill-height">
    <div className="container-content-middle">
      {props.children}
    </div>
  </div>
)

export default LoginView
