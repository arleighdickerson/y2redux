import React from 'react'
const _ = require('lodash')

const PAGE_MAP = {}

export const Index = (store) => ({
  path: 'progs',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const IndexView = require('./components/IndexView').default
      cb(null, IndexView)
    }, 'prog-index')
  }
})

export const Detail = (store) => ({
  path: 'progs/:name',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const {name} = nextState.params
      const DetailView = require('./components/DetailView').default
      const Page = require('./components/pages/' + name).default
      const Component = props => (
        <DetailView name={nextState.params.name } {...props}><Page/></DetailView>
      )
      cb(null, Component)
    }, 'prog-detail')
  }
})
