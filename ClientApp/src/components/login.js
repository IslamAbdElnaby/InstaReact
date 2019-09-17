import React, { Component } from "react";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { actionCreators } from "../store/Auth";
import { withRouter } from "react-router-dom";
class Login extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn === true) {
      console.log(nextProps.loggedIn);
      this.props.history.push("/");
    }
  }
  state = {
    name: "",
    password: ""
  };
  redirect = () => {};
  signin(e) {
    e.preventDefault();
    this.props.login(this.state.name, this.state.password);
    this.props.getAppUser(localStorage.getItem("id"));
  }

  errors = () => {
    if (this.props.error)
      return (
        <p className="alert-danger" style={{ padding: 6 }}>
          {this.props.error}
        </p>
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
            <h2 className="text-info text-center">Login Form</h2>
            <br />
            <form onSubmit={e => this.signin(e)}>
              {this.errors()}
              <div className="form-group">
                <label htmlFor="name">Username</label>
                <input
                  name="name"
                  type="name"
                  className="form-control"
                  onChange={e => {
                    e.preventDefault();
                    this.setState({ name: e.target.value });
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
                    this.setState({ password: e.target.value });
                  }}
                  className="form-control"
                />
              </div>
              <br />
              <br />
              <div className="form-group text-center">
                <input
                  type="submit"
                  value="Login"
                  className="btn btn-primary"
                />
                <Link to="/register" className="text-primary">
                  Create new account?
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
  )(Login)
);
