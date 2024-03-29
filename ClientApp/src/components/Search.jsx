import React, { Component } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../store/Home";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "@terebentina/react-popover/lib/styles.css";

class Search extends Component {
  state = { active: 0, blur: 0 };
  renderSearchUsers = () => {
    const users = this.props.users;
    if (users === undefined) return;
    return (
      <div
        style={{
          height: "150px",
          maxHeight: "150px",
          overflow: "auto !important",
          overflowX: "hidden !important"
        }}
      >
        {users.map(user => (
          <div className="row" key={user.id} style={{ paddingLeft: "5%" }}>
            <Link to={`/profile/${user.name}`}>
              <img
                style={{ height: "40px", width: "40px" }}
                src={user.picPath}
                alt=""
                className="img-thumbnail img-user-post"
              />
              {user.name}
            </Link>
          </div>
        ))}
      </div>
    );
  };
  componentWillReceiveProps(nextProps) {
    const users = nextProps.users;
    if (this.state.blur !== 1 && users !== undefined && users.length > 0)
      this.setState({ active: 1 });
    else this.setState({ active: 0 });
  }
  render() {
    return (
      <React.Fragment>
        <div className="form-group">
          <div className="row">
            <div
              className={`popover popover--bottom ${this.state.active &&
                "popover--active"}`}
            >
              <input
                type="text"
                className="form-control popover__trigger"
                name="search"
                placeholder="username..."
                onChange={e => {
                  e.preventDefault();
                  const s = e.target.value.trim();
                  this.props.search(s);
                }}
                onBlur={e => {
                  e.preventDefault();
                  this.setState({ blur: 1 });
                }}
                onFocus={e => {
                  e.preventDefault();
                  this.setState({ blur: 0 });
                }}
              />
              <div className="popover__content">{this.renderSearchUsers()}</div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  state => state.home,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Search);
