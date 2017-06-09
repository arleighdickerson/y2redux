import React from 'react'
const _ = require('lodash')

const Item = ({name, percent}) => (
  <div className="item">
    <h3 className="level-title">
      {name}
    </h3>
    <div className="level-bar">
      <div className="level-bar-inner" data-level={percent + '%'} style={{width: percent + '%'}}/>
    </div>
  </div>
)

export default function skills(props) {
  return (
    <aside className="skills aside section">
      <div className="section-inner">
        <h2 className="heading">Skills</h2>
        <div className="content">
          <div className="skillset">
            {_
              .chain(props)
              .mapValues((percent, name) => <Item {...{percent, name}} key={name}/>)
              .toArray()
              .value()
            }
          </div>
        </div>
      </div>
    </aside>
  )
}
