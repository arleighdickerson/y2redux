import React from "react";
import {login} from "../../../store/user";
import LoginView from "../components/LoginView";
import LoginForm from "../components/LoginForm";
import {getFormValues} from "redux-form";
import {connect} from "react-redux";

const mapDispatchToProps = {
  handleSubmit: login
};

const mapStateToProps = (state) => {
  return {...getFormValues('loginform')(state)}
}

const LoginContainer = (props) => (
  <LoginView>
    <LoginForm {...props}/>
  </LoginView>
)
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)

