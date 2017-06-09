import React, {Component} from 'react'
import PropTypes from 'prop-types'
import FeedHeader from './head/feedHeader'
import FeedBody from './body/eventList'
import FeedFooter from './footer/footer'
import {styles} from './styles'

export default class GithubFeed extends Component {
  render() {
    const {fullName, username, avatarUrl, profileUrl, events} = this.props;

    return (
      <div style={styles.githubFeed}>
        <FeedHeader
          fullName={fullName}
          username={username}
          avatarUrl={avatarUrl}
          profileUrl={profileUrl}
          styles={styles}
        />
        <FeedBody
          events={events}
          styles={styles}
        />
        <FeedFooter
          styles={styles}
        />
      </div>
    );
  }
}

GithubFeed.propTypes = {
  fullName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired,
  profileUrl: PropTypes.string,
  events: PropTypes.array.isRequired
}
