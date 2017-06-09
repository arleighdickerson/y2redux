import React from "react";
import {closeAll} from './Dropdown'

const routesMatch = (r0, r1) => {
  const format = route => route === '/' ? route : route.trim('/').toLowerCase()
  return format(r0) === format(r1)
}

export function Item({label, route, current, handleClick}) {
  const onClick = () => {
    closeAll()
    handleClick(route)
  }
  const liProps = routesMatch(route, current)
    ? {className: 'active'}
    : {};
  return (
    <li key={'a' + route} {...liProps} onClick={onClick}>
      <a href="javascript:;">{label}</a>
    </li>
  )
}

export default Item
