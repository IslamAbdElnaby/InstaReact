import axios from "axios";
const GET_POSTS = "GET_POSTS";
const LIKE = "LIKE";
const COMMENT = "COMMENT";
const ADD_POST = "ADD_POST";
export const initialState = [];

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
  }
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS:
      return payload.posts;
    case COMMENT:
      const { comment } = payload;
      return state.map(post => {
        if (post.id === comment.postId) post.comments.push(comment);
        return post;
      });
    case LIKE:
      return state.map(post => {
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
      });
    case ADD_POST:
      return [payload.post, ...state];
    default:
      return state;
  }
};
