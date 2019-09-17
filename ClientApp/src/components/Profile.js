import React, { Component } from "react";
import "../CSS/post.css";
import Post from "./Post";
import { actionCreators } from "../store/Profile";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route, Link, withRouter } from "react-router-dom";
import FollowView from "./FollowView";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loading: true
    };
  }
  componentDidMount() {
    const { username } = this.props.match.params;
    this.setState({ username });
    this.props.getProfile(username);
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
    // getProfile(username).then(res => {
    //   isFollowing(res.id).then(f => {
    //     this.setState({ follow: f });
    //   });
    //   this.setState({ profile: res });
    //   this.props.getHomePosts(res.identityId);
    // });
  }
  componentDidUpdate(prevProps, prevState) {
    const { username } = prevProps.match.params;
    const curUsername = this.props.match.params.username;
    if (curUsername != username) {
      this.refs.followModal.style.display = "none";
      this.props.history.go();
    }
  }
  renderPostModel = () => {
    return (
      <div ref="postModal" className="modal">
        <span
          className="close"
          onClick={() => {
            this.refs.postModal.style.display = "none";
          }}
        >
          &times;
        </span>
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <Post
              isProfile="1"
              className="modal-content"
              post={this.props.profile.posts[this.state.postIdx]}
            />
          </div>
        </div>
      </div>
    );
  };
  renderFollwing = () => {
    const username = localStorage.getItem("name");
    const { name, id } = this.props.profile;
    if (username === name)
      return <button className="btn btn-info">Edit profile</button>;
    return (
      <button
        className="btn btn-info"
        onClick={e => {
          e.preventDefault();
          this.props.follow(id);
        }}
      >
        {this.props.profile.follow ? "Unfollow" : "Follow"}
      </button>
    );
  };
  renderFollowModal = () => {
    return (
      <div ref="followModal" className="modal">
        <span
          className="close"
          onClick={e => {
            e.preventDefault();
            this.props.history.goBack();
            this.refs.followModal.style.display = "none";
          }}
        >
          &times;
        </span>
        <div className="row">
          <div className="col-2"></div>
          <div className="col-9">
            <Route path="/profile/:username/:follow" component={FollowView} />
          </div>
        </div>
      </div>
    );
  };
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
  render() {
    if (this.state.loading) return this.loading();
    if (this.props.profile.posts === undefined) return <div></div>;
    return (
      <div className="container" style={{ paddingBottom: 25, paddingTop: 50 }}>
        {this.renderPostModel()}
        {this.renderFollowModal()}
        <div className="row" style={{ height: "auto" }}>
          <div className="col-md-2"></div>
          <div className="col-md-2">
            <img
              src={this.props.profile.picPath}
              style={{ borderRadius: "50%", width: 100, height: 100 }}
              className="img-thumbnail"
            />
          </div>
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-2" style={{ fontSize: 20 }}>
                {this.props.profile.name}
              </div>
              <div className="col-md-3">{this.renderFollwing()}</div>
            </div>
            <div className="row">
              <div className="col-md-2" style={{ fontSize: 18 }}>
                {this.props.profile.posts.length} Posts
              </div>
              <div className="col-md-2" style={{ fontSize: 18 }}>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={e => {
                    e.preventDefault();

                    this.refs.followModal.style.display = "block";
                    this.props.history.push(
                      `/profile/${this.state.username}/followers`
                    );
                  }}
                >
                  {this.props.profile.followers.length} Followers
                </p>
              </div>
              <div className="col-md-2" style={{ fontSize: 18 }}>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={e => {
                    e.preventDefault();

                    this.refs.followModal.style.display = "block";
                    this.props.history.push(
                      `/profile/${this.state.username}/following`
                    );
                  }}
                >
                  {this.props.profile.following.length} Following
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {this.props.profile.posts.map((p, idx) => (
            <div
              key={p.id}
              className="col-md-4"
              style={{
                marginTop: 25
              }}
            >
              <div
                onClick={() => {
                  this.refs.postModal.style.display = "block";
                  this.setState({ postIdx: idx });
                }}
                className="image-post"
                style={{
                  height: 200,
                  backgroundImage: `url(${p.picPath})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover"
                }}
              >
                <p>
                  <span className="fa fa-lg fa-heart">{p.likes.length}</span>
                  <span
                    className="fa fa-lg fa-comment"
                    style={{ marginLeft: "10%" }}
                  >
                    {p.comments.length}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(
    state => {
      return { profile: state.profile };
    },
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Profile)
);
