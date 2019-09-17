import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators as HomeActions } from "../store/Home";
import { actionCreators as ProfileActions } from "../store/Profile";
import { getAppUserById } from "../store/Auth";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heartClick: 0,
      comment: "",
      user: { name: "" },
      appUser: {}
    };
  }
  componentDidMount() {
    try {
      getAppUserById(this.props.state.auth.id).then(user => {
        this.setState({ appUser: user });
        const post = this.props.post;
        if (post !== undefined) {
          const len = post.likes.filter(l => l.userId === user.id).length;
          this.setState({ heartClick: len });
        }
      });
      getAppUserById(this.props.post.instaUserId).then(res =>
        this.setState({ user: res })
      );
    } catch (error) {
      return;
    }
  }
  //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
  componentWillReceiveProps(nextProps) {
    try {
      getAppUserById(nextProps.post.instaUserId).then(res =>
        this.setState({ user: res })
      );
      const post = nextProps.post;
      const user = this.state.appUser;
      const length = post.likes.filter(l => l.userId === user.id).length;
      this.setState({ heartClick: length });
    } catch (error) {}
  }
  changeHeart = () => {
    const appUser = this.state.appUser;
    const like = this.props.post.likes.filter(l => l.userId === appUser.id);
    if (like.length === 0)
      this.toggleLike({
        id: -1,
        postId: this.props.post.id,
        userId: appUser.id
      });
    else this.toggleLike(like[0]);
  };
  toggleLike = like => {
    if (this.props.isProfile === undefined) {
      this.props.setLike(like);
    } else {
      this.props.setLikeProfile(like);
    }
  };
  addComment = comment => {
    if (this.props.isProfile === undefined) {
      this.props.addComment(comment);
    } else this.props.addCommentProfile(comment);
  };
  renderComment = c => {
    return (
      <div className="row" key={c.id}>
        <div className="m-2"></div>
        <Link to={`/profile/${c.userName}`} className="link-dark">
          {c.userName}
        </Link>
        <div className="col-md-9">{c.comment}</div>
        <div className="col-md-1">
          <span hidden className="fa fa-heart-o fa-left">
            {c.likes.length === 0 ? "" : c.likes.length}
          </span>
        </div>
      </div>
    );
  };

  render() {
    const post = this.props.post;
    if (post === undefined) return <p></p>;

    return (
      <div className="row">
        <div className="col-sm-2"></div>
        <div
          className="col-sm-8 form-control"
          style={{ height: "auto", padding: 30 }}
        >
          <div>
            <Link to={`/profile/${this.state.user.name}`} className="link-dark">
              <img
                src={this.state.user.picPath}
                className="img-thumbnail img-user-post"
              />
              <span>{this.state.user.name}</span>
            </Link>
          </div>
          <div className="row">
            <img
              style={{ width: "100%", height: "100%" }}
              src={post.picPath}
              className="img-fluid"
              onDoubleClick={() => this.changeHeart()}
            />
          </div>
          <div className="row">
            <span
              className={`btn fa fa-lg fa-heart ${this.state.heartClick &&
                "text-danger"}`}
              onClick={() => this.changeHeart()}
            >
              <span style={{ color: "#000" }}>
                {post.likes.length === 0 ? "" : post.likes.length}
              </span>
            </span>

            <span className="btn fa fa-lg fa-comment"></span>
          </div>
          <div className="row">
            <Link to={`/profile/${this.state.user.name}`} className="link-dark">
              <p>{this.state.user.name}</p>
            </Link>
            <p style={{ marginLeft: 5 }}> {post.caption}</p>
          </div>
          <div
            style={{ maxHeight: 150, overflowY: "scroll", overflowX: "hidden" }}
          >
            {post.comments.map(c => {
              return this.renderComment(c);
            })}
          </div>
          <div className="row">
            <br />
            <span style={{ color: "grey" }}>
              {new Date(post.date).toString().substr(0, 21)}
            </span>
          </div>
          <form
            className="row"
            onSubmit={e => {
              e.preventDefault();
              this.setState({ comment: "" });
              this.addComment({
                comment: this.state.comment,
                id: -1,
                postId: post.id,
                userId: this.state.appUser.id,
                userName: this.state.appUser.name,
                likes: []
              });
            }}
          >
            <input
              style={{ marginTop: 11 }}
              type="text"
              name="comment"
              value={this.state.comment}
              className="form-control"
              placeholder="add a comment..."
              onChange={e => {
                e.preventDefault();
                this.setState({ comment: e.target.value });
              }}
            />
          </form>
        </div>
      </div>
    );
  }
}
export default connect(
  state => {
    return { state: state };
  },
  dispatch =>
    bindActionCreators(Object.assign({}, HomeActions, ProfileActions), dispatch)
)(Post);
