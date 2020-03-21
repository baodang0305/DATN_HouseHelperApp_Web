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
import MyAccount from './MyAccount/MyAccount';
import history from '../helpers/history';

export default class Root extends Component {
  
  render() {
    
    return (
      <Router history={history}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-family" component={Register} />
          <Route path="/tasks" component={Task} />
          <Route path="/family/add-member" component={AddMember} />
          <Route path="/family/message" component={Message} />
          <Route path="/family/setting/my-account" component={MyAccount} />
          <Route path="/family/setting" component={Setting} />
          <Route path="/family" component={Family} />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}
