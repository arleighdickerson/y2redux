import React from "react";
import RaisedButton from "material-ui/RaisedButton";
import {TextField} from "redux-form-material-ui";
import {reduxForm, Field} from "redux-form";

const constraints = {
  username: {
    presence: true,
  },
  password: {
    presence: true,
  },
};

const validate = require('../../../util/validate')(constraints)

export class LoginForm extends React.Component {
  render() {
    const {username, password, handleSubmit, pristine, submitting} = this.props;
    return (
      <form action="/login" method="POST" onSubmit={(e)=> {
        e.preventDefault();
        handleSubmit(username, password);
      }}>
        <div>
          <Field fullWidth={true} component={TextField} hintText='username' name='username' value={username}/>
        </div>
        <div>
          <Field fullWidth={true} component={TextField} hintText='password' name='password' type='password'
                 value={password}/>
        </div>
        <div>
          <RaisedButton fullWidth={true} type='submit' disabled={pristine || submitting} label='Submit' primary={true}/>
        </div>
      </form>
    )
  }
}
;

export default reduxForm({
  form: 'loginform',
  validate
})(LoginForm);
