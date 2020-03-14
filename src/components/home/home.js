import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./home.css";
import "antd/dist/antd.css";


import { Button, Row } from "antd"
export default class Home extends Component {
  render() {
    return (
      <div className="main-container">
        <div className="ct-title">
          <Link className="title" to="/">
            Welcome to My Home
          </Link>
        </div>
        <div className="bg">
        </div>
        <div className="btn-sign">
          <Button className="login-btn" danger size="large">
            <Link to="/login">Log in</Link>
          </Button>
          <Button className="register-btn" type="primary" ghost size="large">
            <Link to="/create-family">Create Family</Link>
          </Button>
        </div>

      </div>
    );
  }
}
