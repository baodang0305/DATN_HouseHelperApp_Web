import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Family from './Family/Family';
import Home from './Home/Home';
import Task from './Task/Task';

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
          <Route path="/family">
            <Family/>
          </Route>
          <Route path="/tasks">
            <Task />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
