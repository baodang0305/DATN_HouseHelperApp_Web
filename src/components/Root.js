import React, { Component } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import Family from './Family/Family';
import Home from './Home/Home';
import Task from './Task/Task';
import AddMember from './AddMember/AddMember';
import Message from './Message/Message';
import Setting from './Setting/Setting';
import history from '../helpers/history';

export default class Root extends Component {
  
  render() {
    
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/create-family">
            <Register />
          </Route>
          <Route path="/tasks">
            <Task />
          </Route>
          <Route path="/family/add-member">
            <AddMember />
          </Route>
          <Route path="/family/message">
            <Message />
          </Route>
          <Route path="/family/setting">
            <Setting />
          </Route>
          <Route exact path="/family">
            <Family/>
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    );
  }
}
