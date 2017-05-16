import React from "react";
import PropTypes from 'prop-types'
import SignupView from "../components/SignupView";
import SignupForm from "../components/SignupForm";
import {getFormValues, SubmissionError} from "redux-form";
import {connect} from "react-redux";
import {signup} from "../../../store/user"

const mapDispatchToProps = {
  onSubmit: (attributes) => {
    return dispatch => dispatch(signup(attributes)).catch(err => {
      throw new SubmissionError(err.response.body)
    })
  }
}

const mapStateToProps = (state) => {
  return {...getFormValues('signupform')(state)}
}

class SignupContainer extends React.Component {
  render() {
    const props = {...this.context, ...this.props}
    return (
      <SignupView>
        <SignupForm {...props}/>
      </SignupView>
    )
  }
}

SignupContainer.contextTypes = {
  store: PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer)
