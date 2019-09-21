import axios from "axios";
const GET_POSTS = "GET_POSTS";
const LIKE = "LIKE";
const COMMENT = "COMMENT";
const ADD_POST = "ADD_POST";
const SEARCH = "SEARCH";
const CLEAR = "CLEAR";
const NOTIFICATIONS = "NOTIFICATIONS";
export const initialState = { posts: [], users: [], notifications: [] };

export const searchByName = async search => {
  const res = await axios.get(`api/home/SearchByName/${search}`);
  const users = await res.data;
  return users;
};
export const actionCreators = {
  getHomePosts: id => async dispatch => {
    const res = await axios.get(`api/home/getPosts/${id}`);
    const posts = await res.data;
    dispatch({ type: GET_POSTS, payload: { posts } });
  },
  setLike: like => async dispatch => {
    const res = await axios.post(`api/home/like`, like);
    like.id = await res.data;
    dispatch({ type: LIKE, payload: { like } });
  },
  addComment: comment => async dispatch => {
    const res = await axios.post(`api/home/comment`, comment);
    comment.id = await res.data;
    dispatch({ type: COMMENT, payload: { comment } });
  },
  addPost: post => async dispatch => {
    const res = await axios.post(`api/home/AddPost`, post);
    const id = await res.data;
    post.id = id;
    dispatch({ type: ADD_POST, payload: { post } });
  },
  search: search => async dispatch => {
    let users = [];
    if (search !== "") users = await searchByName(search);
    dispatch({ type: SEARCH, payload: users });
  },
  clear: () => dispatch => {
    dispatch({ type: CLEAR });
  },
  getNotifications: userId => async dispatch => {
    const res = await axios.get(`api/home/getNotifications/${userId}`);
    const nots = res.data;
    dispatch({ type: NOTIFICATIONS, payload: nots });
  }
};
export const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  const { posts } = state;
  switch (type) {
    case GET_POSTS:
      return { ...state, posts: payload.posts };
    case COMMENT:
      const { comment } = payload;
      return {
        ...state,
        posts: posts.map(post => {
          if (post.id === comment.postId) post.comments.push(comment);
          return post;
        })
      };
    case LIKE:
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
    case ADD_POST:
      return { ...state, posts: [payload.post, ...posts] };
    case SEARCH:
      return { ...state, users: payload };
    case CLEAR:
      return initialState;
    case NOTIFICATIONS:
      return { ...state, notifications: payload };
    default:
      return state;
  }
};
