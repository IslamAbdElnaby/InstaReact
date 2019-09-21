import React, { Component } from "react";
import { connect } from "react-redux";
import { actionCreators as HomeActions } from "../store/Home";
import { actionCreators as AuthActions } from "../store/Auth";
import { bindActionCreators } from "redux";
import Post from "./Post";
import { withRouter, Link } from "react-router-dom";
import "../CSS/post.css";
import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: 1, image: "", caption: "" };
  }
  componentWillUnmount() {}
  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    console.log("loading");
    console.log(this.state.loading);
    console.log(this.refs.addPostModal);
    if (this.state.loading !== 0) {
      setTimeout(() => {
        this.setState({ loading: 0 });
        this.refs.addPostModal.style.display = "none";
      }, 1000);
    }
  }
  componentDidMount() {
    const id = this.props.state.auth.id;
    if (id !== null && this.props.state.auth.loggedIn === true) {
      this.props.getHomePosts(id);
      this.props.getAppUser(id);
    } else this.props.history.push("/login");
    setTimeout(() => {
      this.setState({ loading: 0 });
    }, 1000);
  }
  componentWillMount() {}

  loading = () => {
    return (
      <div className="row" style={{ marginTop: "2%" }}>
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ marginLeft: "50%" }}
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  };
  addPost = async e => {
    e.preventDefault();
    // let fd = new FormData();
    // fd.append("image", this.state.image, this.state.image.name);
    const f = new FormData();
    f.append("File", this.state.image);
    const res = await axios.post("api/home/AddImage", f, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    const picPath = await res.data;
    if (picPath !== null) {
      const post = {
        picPath: picPath,
        caption: this.state.caption,
        Id: 0,
        instaUserId: this.props.state.auth.appUser.id,
        likes: [],
        comments: [],
        date: ""
      };
      await this.props.addPost(post);
    }
  };
  renderPostModel = () => {
    return (
      <div ref="addPostModal" className="modal">
        <span
          className="close"
          onClick={() => {
            this.refs.addPostModal.style.display = "none";
          }}
        >
          &times;
        </span>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-4">
            <form
              encType="multipart/form-data"
              className="form-control"
              onSubmit={e => {
                this.addPost(e);
                this.setState({ loading: 1 });
                // this.refs.addPostModal.style.display = "none";
              }}
              style={{ height: "auto", padding: "10px 10px" }}
            >
              <div className="form-group">
                <label htmlFor="image">Select photo</label>
                <input
                  name="image"
                  type="file"
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ image: e.target.files[0] });
                  }}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="caption">Caption</label>
                <input
                  name="caption"
                  type="text"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ caption: e.target.value });
                  }}
                  className="form-control"
                />
              </div>
              <br />
              <br />
              <div className="form-group text-center">
                <input type="submit" value="Post" className="btn btn-primary" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  render() {
    if (this.state.loading === 1) return this.loading();
    const { posts } = this.props.state.home;
    return (
      <div className="container">
        {this.renderPostModel()}
        <div className="row">
          <div className="col-sm-5"></div>
          <div className="col-sm-6">
            <div className="row">
              <button
                className="btn btn-primary fa fa-lg fa-plus"
                onClick={() => {
                  this.refs.addPostModal.style.display = "block";
                }}
              >
                Add Photo
              </button>
            </div>
          </div>
        </div>
        <div style={{ marginTop: "5%" }}>
          {posts.map(p => (
            <Post key={p.id} post={p} />
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => {
      return { state: state };
    },
    dispatch =>
      bindActionCreators(Object.assign({}, HomeActions, AuthActions), dispatch)
  )(Home)
);
