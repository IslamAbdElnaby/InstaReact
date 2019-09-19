import React, { Component } from "react";
import { Container } from "reactstrap";
import NavMenu from "./NavMenu";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { actionCreators } from "../store/Home";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = { width: 1440 };
    this.resize = this.resize.bind(this);
  }
  resize() {
    this.setState({ width: window.innerWidth });
  }
  renderSearch = () => {
    return;
    const { users } = this.props;
    if (this.state.width <= 575) return;
    return (
      <div
        style={{
          marginLeft: "40%",
          width: "210px",
          position: "absolute",
          zIndex: "9999"
        }}
      >
        <div
          className="form-control"
          style={{
            display: `${users.length === 0 ? "none" : "block"}`,
            height: "auto",
            maxHeight: "350px",
            overflow: "scroll",
            overflowX: "hidden"
          }}
        >
          {users.map(user => (
            <div className="row" key={user.id} style={{ paddingLeft: "4%" }}>
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
      </div>
    );
  };
  componentDidMount() {
    window.addEventListener("resize", this.resize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }
  componentWillReceiveProps(nextProps) {
    const { pathname } = nextProps.history.location;
    if (this.props.location.pathname !== pathname) this.props.clear();
  }
  render() {
    return (
      <div>
        <NavMenu />
        <Container>{this.props.children}</Container>
      </div>
    );
  }
}

export default withRouter(
  connect(
    state => state.home,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Layout)
);
