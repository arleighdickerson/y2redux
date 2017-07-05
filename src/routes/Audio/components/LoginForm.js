const _ = require('lodash')
import React from "react";
import {FormGroup as FG} from "react-bootstrap";
import {Field, reduxForm} from "redux-form";
import Input from "../../../components/Input";
import {Link} from "react-router";

const constraints = {
  username: {
    presence: true,
  }
};

const validate = require('../../../util/validate')(constraints)

export const FORM_NAME = 'audio-loginform'

class LoginForm extends React.Component {
  render() {
    const {username, submitting,onSurprise} = this.props;
    return (
      <form
        className="m-x-auto text-center app-login-form"
        role="form"
        onSubmit={this.props.handleSubmit(this.props.onSubmit)}
      >
        <Link to="/" className="app-brand lg"
              style={{width: '100%', textDecoration: 'none', fontFamily: 'Roboto-Bold'}}>
          <h1>[Demo]</h1>
        </Link>
        <p>Supply a username to continue. Anything will do...</p>
        <Field
          component={Input}
          placeholder='username'
          name='username'
          value={username}
          disabled={submitting}
        />
        <div className="m-b-lg">
          <button type="submit" className="btn btn-primary" disabled={submitting}>Log In</button>
          <button className="btn btn-default" disabled={submitting}>Sign up</button>
        </div>

        <footer className="screen-login">
          <a href="javascript:;" className="text-muted" onClick={onSurprise}>Surprise Me</a>
        </footer>
      </form>
    )
  }
}

export default reduxForm({
  form: FORM_NAME,
  validate
})(LoginForm);
