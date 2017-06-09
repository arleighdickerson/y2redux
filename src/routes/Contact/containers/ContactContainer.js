import React from "react";
import PropTypes from "prop-types";
import ContactView from "../components/ContactView";
import ContactForm, {FORM_NAME} from "../components/ContactForm";
import {sendForm} from "../modules/contact";
import {change, getFormValues, SubmissionError} from "redux-form";
import {connect} from "react-redux";
const _ = require('lodash')


const mapDispatchToProps = {
  onSubmit: (attributes) => {
    return dispatch => dispatch(sendForm(attributes))
      .catch(err => {
        console.error(err)
        throw new SubmissionError({
          // attribute -> errorMessage:string
        })
      })
  },
  captchaVerified(hash)  {
    console.log('[RCA] input verified')
    return change(FORM_NAME, 'recaptcha', hash)
  },
}

const mapStateToProps = (state) => {
  return {...getFormValues(FORM_NAME)(state)}
}

class ContactContainer extends React.Component {
  render() {
    const props = {...this.context, ...this.props}
    return (
      <ContactView>
        <ContactForm {...props}/>
      </ContactView>
    )
  }
}

ContactContainer.contextTypes = {
  store: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactContainer)
