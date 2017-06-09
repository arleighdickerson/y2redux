import React from 'react'
import Octicon from './Octicon'
export default (props) => {
  return (
    <div style={ props.styles.githubIcon }>
      <Octicon name="mark-github" mega/>
    </div>
  );
}
