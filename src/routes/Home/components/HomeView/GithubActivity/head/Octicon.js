require('octicons/octicons/octicons.css')
require('react-octicon/css/Octicon.css')

import React from 'react'
import PropTypes from 'prop-types'

export default function Octicon({name, className, mega, spin, ...props}) {
  let classNames = [mega ? 'mega-octicon' : 'octicon', `octicon-${name}`]
  if (spin) {
    classNames.push('spin-octicon')
  }
  if (className) {
    classNames.push(className)
  }
  return <span {...props} className={classNames.join(' ')}/>
}

Octicon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  mega: PropTypes.bool,
  spin: PropTypes.bool
}

Octicon.defaultProps = {
  mega: false,
  spin: false
}
