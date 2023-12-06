// UserService.js

let users = [];

const createUser = (userId) => {
  const newUser = {
    id: userId,
    watchedVideos: [],
    likedVideos: [],
  };
  users.push(newUser);
};

const getUser = (userId) => {
  return users.find((user) => user.id === userId);
};

const updateUserWatchedVideos = (userId, videoId) => {
  const user = getUser(userId);
  if (user) {
    user.watchedVideos.push({
      id: videoId,
      title: `Video ${videoId}`,
      // Other video details...
    });
  }
};

const updateUserLikedVideos = (userId, videoId) => {
  const user = getUser(userId);
  if (user) {
    user.likedVideos.push({
      id: videoId,
      title: `Video ${videoId}`,
      // Other video details...
    });
  }
};

export { createUser, getUser, updateUserWatchedVideos, updateUserLikedVideos };
