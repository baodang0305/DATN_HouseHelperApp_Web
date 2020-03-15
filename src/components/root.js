import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './login/login';
import Register from './register/register';
import Home from './home/home';
import Landing from './landing/landing';

export default class Root extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/create-family">
            <Register />
          </Route>
          <Route path="/onboard">
            <Home />
          </Route>
          <Route exact path="/">
            {/* <Home /> */}
            <Landing />
          </Route>
        </Switch>
      </Router>
    );
  }
}
