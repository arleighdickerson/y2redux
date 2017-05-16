import React from "react";
//import {FormGroup, ControlLabel, FormControl} from "react-bootstrap";
import * as rb from "react-bootstrap";
const _ = require('lodash')

const COMPONENT_CLASSES = {
  'FormGroup': rb.FormGroup,
  'ControlLabel': rb.ControlLabel,
  'FormControl': rb.FormControl,
  'FormControl.Feedback': rb.FormControl.Feedback
}

const createFactory = componentClasses => {
  const map = {...COMPONENT_CLASSES, ...componentClasses}
  return name => map[name]
}

export default class Input extends React.Component {
  render() {
    const {
      componentClasses,
      feedbackIcon,
      input,
      label,
      type,
      meta: {error, warning, touched},
      ...props
    } = this.props;

    let message;
    const validationState = touched && ( error && "error" ) || ( warning && "warning" ) || null;

    if (touched && ( error || warning )) {
      message = <span className="help-block">{ error || warning }</span>;
    }

    const factory = createFactory(componentClasses)
    const FormGroup = factory('FormGroup')
    const ControlLabel = factory('ControlLabel')
    const FormControl = factory('FormControl')
    const FormControl_Feedback = factory('FormControl.Feedback')

    return (
      <FormGroup validationState={ validationState }>
        {label &&
        <ControlLabel>{ label }</ControlLabel>
        }
        <FormControl { ...input }
                     type={ type }
                     { ...props } />
        { feedbackIcon ? <FormControl_Feedback>{ feedbackIcon }</FormControl_Feedback> : null }
        { message }
      </FormGroup>
    );
  }
}
