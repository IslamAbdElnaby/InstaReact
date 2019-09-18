import axios from "axios";
import { getAppUserById } from "./Auth";
export const GET_PROFILE = "GET_PROFILE";
export const FOLLOW = "FOLLOW";
export const ISFOLLOWING = "ISFOLLOWING";
export const PROFILE_COMMENT = "PROFILE_COMMENT";
export const PROFILE_LIKE = "PROFILE_LIKE";

export const getFollowing = async userId => {
  const res = await axios.get(`api/Profile/GetFollowing/${userId}`);
  const following = await res.data;
  const appUser = await getAppUserById(localStorage.getItem("id"));
  for (let index = 0; index < following.length; index++) {
    const f = following[index];
    const a = await isFollowing(appUser.id, f.id);
    // console.log(appUser.name + " " + a + " " + f.name);
    following[index] = { ...f, follow: a };
  }
  return following;
};
export const getFollowers = async userId => {
  const res = await axios.get(`api/Profile/GetFollowers/${userId}`);
  const followers = await res.data;
  const appUser = await getAppUserById(localStorage.getItem("id"));
  for (let index = 0; index < followers.length; index++) {
    const f = followers[index];
    const a = await isFollowing(appUser.id, f.id);
    followers[index] = { ...f, follow: a };
  }
  return followers;
};
export const isFollowing = async (followerId, userId) => {
  const isFollow = await axios.get(
    `api/Profile/IsFollowing/${followerId}/${userId}`
  );
  return await isFollow.data;
};

export const actionCreators = {
  getProfile: username => async dispatch => {
    const res = await axios.get(`api/Profile/${username}`);
    const profile = await res.data;
    const following = await getFollowing(profile.id);
    const userId = profile.id;
    const appUser = await getAppUserById(localStorage.getItem("id"));
    const followerId = appUser.id;
    const isFollow = await axios.get(
      `api/Profile/IsFollowing/${followerId}/${userId}`
    );
    const follow = await isFollow.data;
    dispatch({ type: GET_PROFILE, payload: { ...profile, following, follow } });
  },
  follow: userId => async dispatch => {
    const appUser = await getAppUserById(localStorage.getItem("id"));
    const followerId = appUser.id;
    const res = await axios.post(`api/Profile/Follow`, {
      id: -1,
      userId,
      followerId
    });
    const id = await res.data;
    dispatch({
      type: FOLLOW,
      payload: {
        id,
        userId,
        followerId
      }
    });
  },
  isFollow: userId => async dispatch => {
    const appUser = await getAppUserById(localStorage.getItem("id"));
    const follow = await isFollowing(appUser.id, userId);
    dispatch({ type: ISFOLLOWING, payload: follow });
  },
  setLikeProfile: like => async dispatch => {
    const res = await axios.post(`api/home/like`, like);
    like.id = await res.data;
    dispatch({ type: PROFILE_LIKE, payload: { like } });
  },
  addCommentProfile: comment => async dispatch => {
    const res = await axios.post(`api/home/comment`, comment);
    comment.id = await res.data;
    dispatch({ type: PROFILE_COMMENT, payload: { comment } });
  }
};

export const reducer = (state = {}, action) => {
  const { type, payload } = action;
  const { posts } = state;
  switch (type) {
    case GET_PROFILE:
      return payload;
    case FOLLOW:
      const { id, followerId, userId } = payload;
      const { followers, following } = state;
      const profId = state.id;
      if (id === -1) {
        if (profId === userId) {
          return {
            ...state,
            followers: followers.filter(
              f => !(f.userId === userId && f.followerId === followerId)
            ),
            follow: false
          };
        } else if (profId === followerId) {
          return {
            ...state,
            following: following.filter(f => f.id !== userId)
          };
        } else return state;
      } else {
        if (profId === userId) {
          return {
            ...state,
            followers: [...followers, payload],
            follow: true
          };
        } else if (profId === followerId) {
          return {
            ...state,
            following: [...following, payload]
          };
        } else return state;
      }
    case ISFOLLOWING:
      return { ...state, follow: payload };
    case PROFILE_COMMENT:
      const { comment } = payload;
      return {
        ...state,
        posts: posts.map(post => {
          if (post.id === comment.postId) post.comments.push(comment);
          return post;
        })
      };
    case PROFILE_LIKE:
      return {
        ...state,
        posts: posts.map(post => {
          const { like } = payload;
          if (post.id == like.postId) {
            if (like.id !== -1) {
              post.likes.push(like);
            } else {
              const l = post.likes.find(a => a.userId === like.userId);
              const idx = post.likes.indexOf(l);
              post.likes.splice(idx, 1);
            }
          }
          return post;
        })
      };
    default:
      return state;
  }
};
