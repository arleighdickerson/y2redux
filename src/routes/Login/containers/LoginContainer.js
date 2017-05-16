import React from "react";
import PropTypes from 'prop-types'
import LoginView from "../components/LoginView";
import LoginForm from "../components/LoginForm";
import {getFormValues, SubmissionError} from "redux-form";
import {connect} from "react-redux";
import {login} from "../../../store/user";

const mapDispatchToProps = {
  onSubmit: ({username, password}) => {//, dispatch, state) => {
    return dispatch => dispatch(login(username, password)).catch(err => {
      throw new SubmissionError({password: 'Invalid username or password'})
    })
  }
}


const mapStateToProps = (state) => {
  return {...getFormValues('loginform')(state)}
}

class LoginContainer extends React.Component {
  render() {
    const props = {...this.context, ...this.props}
    return (
      <LoginView>
        <LoginForm {...props}/>
      </LoginView>
    )
  }
}

LoginContainer.contextTypes = {
  store: PropTypes.object
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
