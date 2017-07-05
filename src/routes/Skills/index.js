import React from 'react'
const _ = require('lodash')

export const Index = (store) => ({
  path: 'skills',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const IndexView = require('./components/IndexView').default
      cb(null, IndexView)
    }, 'skill-index')
  }
})

export const Detail = (store) => ({
  path: 'skills/:name',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const {name} = nextState.params
      const DetailView = require('./components/DetailView').default
      const Page = require('./components/pages/' + name).default
      const Component = props => (
        <DetailView name={nextState.params.name } {...props}><Page/></DetailView>
      )
      cb(null, Component)
    }, 'skill-detail')
  }
})
