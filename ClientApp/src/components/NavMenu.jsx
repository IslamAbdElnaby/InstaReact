import React from "react";
import { withRouter } from "react-router-dom";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink
} from "reactstrap";
import { Link, NavLink as nvLink } from "react-router-dom";
import "./NavMenu.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "../store/Auth";
import Search from "./Search";
import Notification from "./Notification";

class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  componentDidMount() {}
  //WARNING! To be deprecated in React v17. Use componentDidUpdate instead.
  componentWillReceiveProps(nextProps) {
    // if (nextProps.loggedIn === false) nextProps.history.push("/login");
    // console.log(nextProps);
    // console.log(this.props);
  }
  componentWillMount() {}

  Auth = () => {
    if (this.props.loggedIn === false) {
      return (
        <React.Fragment>
          <NavItem>
            <NavLink tag={nvLink} className="text-dark" to="/login">
              Login
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={nvLink} className="text-dark" to="/register">
              Register
            </NavLink>
          </NavItem>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <NavItem>
            <NavLink
              tag={nvLink}
              exact
              activeClassName="text-primary"
              className="fa fa-2x fa-instagram"
              to="/"
            ></NavLink>
          </NavItem>
          {/* {
          <NavItem>
            <Notification />
          </NavItem>
          } */}
          <NavItem>
            <NavLink
              tag={nvLink}
              exact
              activeClassName="text-info"
              className="fa fa-2x fa-user-o"
              to={`/profile/${this.props.name}`}
            ></NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              to="/login"
              tag={nvLink}
              exact
              activeClassName="text-warning"
              className="fa fa-2x fa-sign-out"
              onClick={() => {
                localStorage.removeItem("id");
                localStorage.removeItem("name");
                localStorage.removeItem("loggedIn");
                this.props.logout();
              }}
            ></NavLink>
          </NavItem>
        </React.Fragment>
      );
    }
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  renderSearch = () => {
    if (this.props.loggedIn === false) return;
    return (
      <Collapse
        className="d-sm-inline-flex flex-sm-row"
        style={{ marginRight: "2%" }}
        navbar
      >
        <Search />
      </Collapse>
    );
  };

  render() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow "
          light
        >
          <Container style={{ paddingTop: "10px" }}>
            <NavLink tag={nvLink} to="/" style={{ marginRight: "28%" }}>
              <span
                style={{ fontSize: "90% !important" }}
                className="fa fa-2x fa-instagram text-dark"
              >
                Insta
              </span>
            </NavLink>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            {this.renderSearch()}
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={this.state.isOpen}
              navbar
            >
              <ul className="navbar-nav flex-grow">{this.Auth()}</ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
export default withRouter(
  connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(NavMenu)
);
