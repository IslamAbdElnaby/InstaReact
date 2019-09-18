import React, { Component } from "react";
import { Link } from "react-router-dom";
import { actionCreators } from "../store/Home";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
const Search = props => {
  return (
    <React.Fragment>
      <div className="form-group">
        <div className="row">
          <input
            className="form-control"
            type="text"
            name="search"
            placeholder="Search by username"
            onChange={e => {
              e.preventDefault();
              const s = e.target.value.trim();
              props.search(s);
            }}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(
  state => state.home,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Search);
