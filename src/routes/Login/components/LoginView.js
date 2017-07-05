import React from "react";
import {styles} from './LoginView.less'
export const LoginView = (props) => (
  <div className={styles}>
    <div className="container-fluid container-fill-height">
      <div className="container-content-middle">
        {props.children}
      </div>
    </div>
  </div>
)

export default LoginView
