import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators, getFollowers } from "../store/Profile";
import { withRouter } from "react-router-dom";
import { getAppUserById } from "../store/Auth";

class FollowView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      follow: "followers",
      user: { id: 0 },
      loading: true
    };
  }
  componentDidMount() {
    const { follow } = this.props.match.params;
    this.setState({ follow });
    if (follow === "followers") {
      getFollowers(this.props.id).then(data => {
        this.setState({ data });
        setTimeout(() => {
          this.setState({ loading: false });
        }, 500);
      });
    } else {
      this.setState({ data: this.props.following });
      setTimeout(() => {
        this.setState({ loading: false });
      }, 500);
    }
    getAppUserById(localStorage.getItem("id")).then(user =>
      this.setState({ user })
    );
  }
  renderFollow = d => {
    if (d.id === this.state.user.id) return;
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={e => {
          e.preventDefault();
          this.props.follow(d.id);
          d.follow = !d.follow;
        }}
      >
        {d.follow ? "UnFollow" : "Follow"}
      </button>
    );
  };
  loading = () => {
    return (
      <div className="row" style={{ marginTop: "15%", zIndex: 99991 }}>
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
    return (
      <div className="row">
        <div className="col-md-2"></div>
        <div
          className="col-md-7 form-control"
          style={{
            height: "auto",
            paddingTop: "20px"
          }}
        >
          <p className="text-center" style={{ font: "25" }}>
            {this.state.follow}
          </p>
          <div
            style={{
              paddingLeft: "2%",
              maxHeight: "350px",
              overflow: "scroll",
              overflowX: "hidden"
            }}
          >
            {this.state.data.map(d => (
              <div
                className="row"
                key={d.id}
                style={{ paddingRight: "12%", paddingLeft: "2%" }}
              >
                <div className="col-9">
                  <p
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.props.history.push(`/profile/${d.name}`);
                    }}
                  >
                    <img
                      src={d.picPath}
                      alt=""
                      className="img-thumbnail img-user-post"
                    />{" "}
                    {d.name}
                  </p>
                </div>
                <div className="col-3">{this.renderFollow(d)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(
    state => state.profile,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(FollowView)
);
