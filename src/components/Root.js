import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Login/Login';
import Register from './Register/Register';
import Family from './Family/Family';
import Home from './Home/Home';
import Task from './Task/Task';
import AddMember from './AddMember/AddMember';
import Chat from './Chat/ChatContainer/ChatContainer';
import Setting from './Setting/Setting';
import MyAccount from './MyAccount/MyAccount';
import history from '../helpers/history';

const Root = () => {

    return (
        <div>
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/create-family" component={Register} />
                    <Route path="/tasks" component={Task} />
                    <Route path="/family/add-member" component={AddMember} />
                    <Route path="/family/message" component={Chat} />
                    <Route path="/family/setting/my-account" component={MyAccount} />
                    <Route path="/family/setting" component={Setting} />
                    <Route path="/family" component={Family} />
                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
            <ToastContainer />
        </div>
    );
}

export default Root;