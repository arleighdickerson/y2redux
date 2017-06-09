import React, {Component} from 'react'
import GithubFeed from './GithubFeed'
const request = require('superagent')

export default class GithubActivity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: false,
      fetchHasResult: false
    }
  }

  render() {
    if (this.state.fetchHasResult && this.state.events) {
      const feedProps = {...this.props, events: this.state.events}
      return <GithubFeed {...feedProps}/>
    } else {
      return null
    }
  }

  componentDidMount() {
    this.doFetch()
  }

  doFetch() {
    const success = ({body}) => {
      this.setState({
        fetchHasResult: true,
        events: body
      })
    }
    const failure = err => {
      this.setState({
        fetchHasResult: true,
      })
    }
    request
      .get(this.getUrl())
      .type('json')
      .end((err, res) => err ? failure(err) : success(res))
  }

  getUrl() {
    const {username} = this.props
    return this.props.url === undefined ? `https://api.github.com/users/${username}/events` : this.props.url
  }
}

GithubActivity.propTypes = GithubFeed.propTypes
