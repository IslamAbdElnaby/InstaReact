import axios from "axios";
export const LOGIN = "LOGIN";
export const REGISTER = "REGISTER";
export const LOGOUT = "LOGOUT";
export const LOGIN_ERROR = "LOGGIN_ERROR";
export const REGISTER_ERROR = "REGISTER_ERROR";
export const APPUSER = "APPUSER";
export const getAppUserById = async id => {
  if (typeof id === "string") {
    const res = await axios.get(`api/auth/getAppUser/${id}`);
    const appUser = await res.data;
    return appUser;
  }
  const res = await axios.get(`api/auth/getAppUserById/${id}`);
  const appUser = await res.data;
  return appUser;
};
export const initialState = {
  name: localStorage.getItem("name"),
  id: localStorage.getItem("id"),
  loggedIn: localStorage.getItem("loggedIn") === "1" ? true : false,
  appUser: {}
};
export const actionCreators = {
  login: (name, password) => async dispatch => {
    const res = await axios.post("api/auth/login", {
      name: name,
      password: password,
      email: "islam@yahoo.com"
    });
    const id = await res.data;
    if (id !== "") {
      dispatch({ type: LOGIN, payload: { name: name, id: id } });
      localStorage.setItem("loggedIn", "1");
      localStorage.setItem("name", name);
      localStorage.setItem("id", id);
    } else
      dispatch({
        type: LOGIN_ERROR,
        payload: { error: "Username or password is not correct." }
      });
  },
  register: user => async dispatch => {
    const res = await axios.post("api/auth/register", user);
    const data = await res.data;
    if (data.id !== "") {
      dispatch({ type: REGISTER, payload: { name: user.name, id: data.id } });
      localStorage.setItem("loggedIn", "1");
      localStorage.setItem("name", user.name);
      localStorage.setItem("id", data.id);
    } else
      dispatch({
        type: REGISTER_ERROR,
        payload: { errors: data.errors }
      });
  },
  getAppUser: id => async dispatch => {
    const res = await axios.get(`api/auth/getAppUser/${id}`);
    const appUser = await res.data;
    dispatch({ type: APPUSER, payload: { appUser } });
  },
  logout: () => async dispatch => {
    const res = await axios.post(`api/auth/logout`);
    dispatch({ type: LOGOUT });
  }
};

export const reducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN:
    case REGISTER:
      return {
        name: payload.name,
        id: payload.id,
        loggedIn: true,
        appUser: {}
      };
    case LOGOUT:
      return { name: "", id: "", loggedIn: false };
    case LOGIN_ERROR:
      return { loggedIn: false, error: payload.error };
    case REGISTER_ERROR:
      return { loggedIn: false, registerErrors: payload.errors };
    case APPUSER:
      return { ...state, appUser: payload.appUser };
    default:
      return state;
  }
};
