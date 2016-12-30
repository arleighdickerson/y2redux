import React from "react";
import {Link} from "react-router";
export const LoginView = (props) => (
  <div className="container-fluid container-fill-height">
    <div className="container-content-middle">
      <form role="form" className="m-x-auto text-center app-login-form">

        <Link to="/" className="app-brand m-b-lg"
              style={{width:'100%',textDecoration:'none',fontFamily:'Roboto-Bold'}}>
          <h1>[Y2Redux]</h1>
        </Link>

        <div className="form-group">
          <input className="form-control" placeholder="Username"/>
        </div>

        <div className="form-group m-b-md">
          <input type="password" className="form-control" placeholder="Password"/>
        </div>

        <div className="m-b-lg">
          <button className="btn btn-primary">Log In</button>
          <button className="btn btn-default">Sign up</button>
        </div>

        <footer className="screen-login">
          <a href="#" className="text-muted">Forgot password</a>
        </footer>
      </form>
    </div>
  </div>

)

export default LoginView
