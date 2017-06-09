import React from 'react'

export const DetailView = ({name, children}) => (
  <div className="prog-detail">
    <h1>{name}</h1>
    {children}
  </div>
)

export default DetailView
