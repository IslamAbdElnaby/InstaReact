import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/Auth";
import { withRouter } from "react-router-dom";
class Register extends Component {
  componentDidMount() {
    if (this.props.loggedIn === true) this.props.history.push("/");
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn === true) this.props.history.push("/");
  }
  state = {
    name: "",
    email: "",
    password: "",
    confirmpassword: ""
  };
  register(e) {
    e.preventDefault();
    this.props.register(this.state);
    this.props.getAppUser(localStorage.getItem("id"));
  }
  showErrors = () => {
    if (this.props.registerErrors) {
      return this.props.registerErrors.map(e => this.error(e));
    }
  };
  error = e => {
    return (
      <li key={e.code}>
        <p className="alert-danger" style={{ padding: 6 }}>
          {e.description}
        </p>
      </li>
    );
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div
            className="col-md-5 form-control"
            style={{ height: "auto", padding: 25 }}
          >
            <h2 className="text-info text-center">Registeration Form</h2>
            <br />
            <form onSubmit={e => this.register(e)}>
              <ul>{this.showErrors()}</ul>
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <input
                  name="name"
                  type="name"
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  name="password"
                  type="password"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                  className="form-control"
                />
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                  name="confirmpassword"
                  type="password"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ [e.target.name]: e.target.value });
                  }}
                  className={`form-control ${
                    this.state.password !== this.state.confirmpassword
                      ? "border-danger"
                      : ""
                  }`}
                />
              </div>
              <br />
              <br />
              <div className="form-group text-center">
                <input
                  type="submit"
                  value="Register"
                  className="btn btn-primary"
                />
                <Link to="/login" className="text-primary">
                  Have an account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(
  connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
  )(Register)
);
