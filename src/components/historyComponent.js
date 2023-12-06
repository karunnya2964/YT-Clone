// HistoryComponent.js

import React from 'react';
import {
  createUser,
  getUser,
  updateUserWatchedVideos,
  updateUserLikedVideos,
} from '../Watched & Liked vdoss/UserService.js'

class HistoryComponent extends React.Component {
  constructor(props) {
    super(props);

    // Assuming you have some kind of authentication system providing the user ID
    const userId = 'user123';

    // Create a user if they don't exist
    if (!getUser(userId)) {
      createUser(userId);
    }

    this.state = {
      watchedVideos: getUser(userId).watchedVideos,
      likedVideos: getUser(userId).likedVideos,
    };
  }

  handleWatchVideo = (videoId) => {
    const userId = 'user123';
    updateUserWatchedVideos(userId, videoId);
    this.setState({ watchedVideos: getUser(userId).watchedVideos });
  };

  handleLikeVideo = (videoId) => {
    const userId = 'user123';
    updateUserLikedVideos(userId, videoId);
    this.setState({ likedVideos: getUser(userId).likedVideos });
  };

  renderVideoList(videos) {
    return (
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            {video.title}{' '}
            <button onClick={() => this.handleWatchVideo(video.id)}>Watch</button>{' '}
            <button onClick={() => this.handleLikeVideo(video.id)}>Like</button>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div>
        <h2>Watched Videos</h2>
        {this.renderVideoList(this.state.watchedVideos)}

        <h2>Liked Videos</h2>
        {this.renderVideoList(this.state.likedVideos)}
      </div>
    );
  }
}

export default HistoryComponent;
