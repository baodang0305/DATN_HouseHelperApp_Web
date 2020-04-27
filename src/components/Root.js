import React from 'react';
import { ToastContainer } from 'react-toastify';
import { Router, Switch, Route } from 'react-router-dom';

import Alert from './Alert';
import Home from './Home/Home';
import Task from './Task/Task';
import Login from './Login/Login';
import Family from './Family/Family';
import history from '../helpers/history';
import PrivateRoute from './PrivateRoute';
import Calendar from './Calendar/Calendar';
import Member from './Family/Member/Member';
import Setting from './Family/Setting/Setting';
import FormEditTask from './Task/AddTask/EditTask';
import FormCreateTask from './Task/AddTask/AddTask';
import AddEvent from "./Calendar/AddEvent/AddEvent";
import MyAccount from './Family/MyAccount/MyAccount';
import AddMember from './Family/AddMember/AddMember';
import Chat from './Family/Chat/ChatContainer/ChatContainer';
import UpdateFamily from './Family/UpdateFamily/UpdateFamily';
import ActiveAccount from './Family/ActiveAccount/ActiveAccount';
import ResetPassword from './Family/ResetPassword/ResetPassword';
import RegisterFamily from './Register/RegisterFamily/RegisterFamily';
import RegisterAccount from './Register/RegisterAccount/RegisterAccount';

const Root = () => {
    
    return (
        <div>
            <Alert />
            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/create-family" component={RegisterFamily} />
                    <Route path="/create-account" component={RegisterAccount} />
                    <Route path="/reset-password&:id" component={ResetPassword} />
                    <Route path="/activate-account&:id" component={ActiveAccount} />

                    <PrivateRoute path="/edit-task" component={FormEditTask} />
                    <PrivateRoute path='/tasks/add-task' component={FormCreateTask} />
                    <PrivateRoute path="/tasks" component={Task} />

                    <PrivateRoute exact path="/family" component={Family} />
                    <PrivateRoute exact path="/family/chat" component={Chat} />
                    <PrivateRoute exact path="/family/member" component={Member} />
                    <PrivateRoute exact path="/family/setting" component={Setting} />
                    <PrivateRoute exact path="/family/add-member" component={AddMember} />
                    <PrivateRoute exact path="/family/setting/my-account" component={MyAccount} />
                    <PrivateRoute exact path="/family/setting/update-family" component={UpdateFamily} />

                    <PrivateRoute exact path="/calendar" component={Calendar} />
                    <PrivateRoute exact path="/calendar/add-event" component={AddEvent} />

                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
            <ToastContainer />
        </div>
    );
}

export default Root;