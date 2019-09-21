import React, { Component } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../store/Home";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Popover from "@terebentina/react-popover";
import "@terebentina/react-popover/lib/styles.css";

class Notification extends Component {
  state = { active: 0 };

  renderNotifications = () => {
    const notifications = this.props.notifications;
    if (notifications === undefined) return;
    return (
      <div
        className="overflow-auto"
        style={{
          height: "150px",
          maxHeight: "150px"
        }}
      >
        {notifications.map(notify => (
          <div className="row" key={notify.id} style={{ paddingLeft: "15%" }}>
            <Link to={`/profile/${notify.user.name}`}>
              <img
                style={{ height: "40px", width: "40px" }}
                src={notify.user.picPath}
                alt=""
                className="img-thumbnail img-user-post"
              />
              {notify.user.name}
            </Link>
          </div>
        ))}
      </div>
    );
  };
  componentWillReceiveProps(nextProps) {
    const notifications = nextProps.notifications;
    if (notifications !== undefined && notifications.length > 0)
      this.setState({ active: 1 });
    else this.setState({ active: 0 });
  }
  render() {
    return (
      <React.Fragment>
        <div
          className={`popover popover--bottom ${this.state.active &&
            "popover--active"}`}
        >
          <span
            type="text"
            className="fa fa-2x fa-heart-o popover__trigger"
            onClick={e => {
              e.preventDefault();
              this.props.getNotifications(1);
            }}
          />
          <div className="popover__content">{this.renderNotifications()}</div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  state => state.home,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Notification);
