import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const App = props => {
  const { pathname } = props.history.location;
  const renderProfile = () => {
    if (!props.loggedIn) return <div></div>;
    return (
      <div
        className="col-sm-2 form-control"
        style={{ height: 150, position: "relative" }}
      >
        <div className="row">
          <div className="col-sm-12">
            <Link to={`/profile/${props.name}`} className="link-dark">
              <img
                src={props.appUser.picPath}
                className="img-thumbnail img-user-post"
              />
              <span>{props.appUser.name}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  if (pathname.includes("profile")) {
    return (
      <Layout>
        <Route path="/profile/:username" component={Profile} />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="row">
        <div className="col-md-9">
          <Route exact path="/" component={Home} />
        </div>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        {renderProfile()}
      </div>
    </Layout>
  );
};
export default withRouter(connect(state => state.auth)(App));
