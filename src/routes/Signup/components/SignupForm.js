const _ = require('lodash')
import React from "react";
import {Button} from "react-bootstrap";
import {reduxForm, Field} from "redux-form";
import Input from "../../../components/Input"

const constraints = {
  firstName: {
    presence: true,
  },
  lastName: {
    presence: true,
  },
  username: {
    presence: true,
  },
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
  },
  repeatPassword: {
    presence: true,
  },
};

const validate = attributes => {
  const errors = require('../../../util/validate')(constraints)(attributes)
  if (_.isEmpty(errors)) {
    const {password, repeatPassword} = attributes
    if (password !== repeatPassword) {
      errors.repeatPassword = "Passwords do not match"
    }
  }
  return errors
}

class SignupForm extends React.Component {
  render() {
    const {submitting, firstName, lastName, username, email, password, repeatPassword} = this.props
    return (
      <form
        role="form"
        onSubmit={this.props.handleSubmit(this.props.onSubmit)}
      >
        <Field
          component={Input}
          label='First Name'
          name='firstName'
          value={firstName}
          disabled={submitting}
        />
        <Field
          component={Input}
          label='Last Name'
          name='lastName'
          value={lastName}
          disabled={submitting}
        />
        <Field
          component={Input}
          label='Username'
          name='username'
          value={username}
          disabled={submitting}
        />
        <Field
          component={Input}
          label='Email'
          name='email'
          value={email}
          disabled={submitting}
        />
        <Field component={Input}
               label='Password'
               name='password'
               type='password'
               value={password}
               disabled={submitting}
        />
        <Field component={Input}
               label='Repeat Password'
               name='repeatPassword'
               type='password'
               value={repeatPassword}
               disabled={submitting}
        />
        <Button type="submit" bsStyle="primary" disabled={submitting}>Submit</Button>
      </form>
    )
  }
}

export default reduxForm({
  form: 'signupform',
  validate
})(SignupForm);
