import React, { Component } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../store/Home";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "@terebentina/react-popover/lib/styles.css";
import { getAppUserById } from "../store/Auth";

class Notification extends Component {
  constructor(props) {
    super(props);
    // this.heartRef = React.createRef();
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      active: 0,
      user: {}
    };
  }
  onBlur() {
    this.setState({ active: 0 });
  }
  componentDidMount() {
    this.heartRef.addEventListener("blur", this.onBlur);
    getAppUserById(localStorage.getItem("id")).then(user => {
      this.setState({ user });
    });
  }
  componentWillUnmount() {
    this.heartRef.removeEventListener("blur", this.onBlur);
  }

  getTextType = type => {
    switch (type) {
      case "comment":
        return "commented on your photo";
      case "like":
        return "liked your photo";
      case "follow":
        return "started following you";
      default:
        return "";
    }
  };

  renderNotifications = () => {
    const notifications = this.props.notifications.sort((a, b) =>
      a.id > b.id ? -1 : 0
    );
    if (notifications === undefined) return;
    return (
      <div
        className="overflow-auto"
        style={{
          height: "150px",
          maxHeight: "150px",
          paddingTop: "10px",
          paddingLeft: "5px"
        }}
      >
        {notifications.map(notify => (
          <div className="row" key={notify.id} style={{ paddingLeft: "5%" }}>
            <Link to={`/profile/${notify.user.name}`}>
              <img
                style={{ height: "40px", width: "40px" }}
                src={notify.user.picPath}
                alt=""
                className="img-thumbnail img-user-post"
              />
            </Link>
            <div className="text-dark m-1">
              <p>{`${notify.user.name} ${this.getTextType(notify.type)}`}</p>
            </div>
            <img
              hidden={notify.post === null}
              style={{
                height: 40,
                width: 40
              }}
              src={notify.post !== null ? notify.post.picPath : ""}
              alt=""
              className="img-thumbnail"
            />
          </div>
        ))}
      </div>
    );
  };

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <div
        style={{ border: "none" }}
        className={`popover popover--bottom ${this.state.active &&
          "popover--active"}`}
      >
        <a
          href="#"
          className="text-dark"
          onClick={e => {
            e.preventDefault();
            this.setState({ active: !this.state.active });
            if (this.props.notifications.length === 0)
              this.props.getNotifications(this.state.user.id);
          }}
          ref={heart => (this.heartRef = heart)}
        >
          <span className="fa fa-2x fa-heart-o popover__trigger"></span>
        </a>
        <div className="popover__content">{this.renderNotifications()}</div>
      </div>
    );
  }
}

export default connect(
  state => state.home,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Notification);
