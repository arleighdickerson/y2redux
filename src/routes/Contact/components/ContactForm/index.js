import React from "react";
import {Button} from "react-bootstrap";
import {Field, reduxForm} from "redux-form";
import Input from "../../../../components/Input";
const _ = require('lodash')
import Recaptcha from './Recaptcha'

const getSecret = require('../../../../util/secrets')
const validate = require('./validate')

export const FORM_NAME = 'contactform'

const TextArea = props => <Input {...props} componentClass="textarea"/>

const ContactForm = ({
                       name,
                       email,
                       subject,
                       body,
                       submitting,
                       recaptcha,
                       captchaVerified,
                       handleSubmit,
                       onSubmit
                     }) => (
  <form role="form" onSubmit={handleSubmit(onSubmit)}>
    <Field
      component={Input}
      label='Name'
      name='name'
      value={name}
      disabled={submitting}
    />
    <Field
      component={Input}
      label='Email'
      name='email'
      value={email}
      disabled={submitting}
    />
    <Field
      component={Input}
      label='Subject'
      name='subject'
      value={subject}
      disabled={submitting}
    />
    <Field
      component={TextArea}
      label='Body'
      name='body'
      value={body}
      disabled={submitting}
    />
    <Recaptcha
      form={FORM_NAME}
      attribute="recaptcha"
      sitekey={getSecret('google.recaptcha.siteKey')}
      render="explicit"
      onloadCallback={() => console.debug('[RCA] loaded')}
      verifyCallback={captchaVerified}
    />
    <Button type="submit" bsStyle="primary" disabled={submitting || !recaptcha}>Submit</Button>
  </form>
)

export default reduxForm({
  destroyOnUnmount: false,
  form: FORM_NAME,
  fields: [
    'name',
    'email',
    'subject',
    'body',
    'recaptcha'
  ],
  initialValues: {
    recaptcha: false
  },
  validate,
})(ContactForm);
