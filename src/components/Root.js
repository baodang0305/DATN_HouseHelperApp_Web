import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Login/Login';
import RegisterFamily from './Register/RegisterFamily/RegisterFamily';
import RegisterAccount from './Register/RegisterAccount/RegisterAccount';
import Family from './Family/Family';
import Home from './Home/Home';
import Task from './Task/Task';
import AddMember from './AddMember/AddMember';
import Chat from './Chat/ChatContainer/ChatContainer';
import Setting from './Setting/Setting';
import MyAccount from './MyAccount/MyAccount';
import Alert from './Alert';
import history from '../helpers/history';
import FormCreateTask from './Task/AddTask/AddTask';
import FormEditTask from './Task/AddTask/EditTask';
import PrivateRoute from './PrivateRoute';


const Root = () => {
    return (
        <div>
            <Alert />

            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />
                    <Route path="/create-family" component={RegisterFamily} />
                    <Route path="/create-account" component={RegisterAccount} />

                    <PrivateRoute path="/edit-task" component={FormEditTask} />
                    <PrivateRoute path='/tasks/add-task' component={FormCreateTask} />
                    <PrivateRoute path="/tasks" component={Task} />

                    <PrivateRoute path="/family/add-member" component={AddMember} />
                    <PrivateRoute path="/family/chat" component={Chat} />
                    <PrivateRoute path="/family/setting/my-account" component={MyAccount} />
                    <PrivateRoute path="/family/setting" component={Setting} />
                    <PrivateRoute path="/family" component={Family} />

                    <Route exact path="/" component={Home} />
                </Switch>
            </Router>
            <ToastContainer />
        </div>
    );
}

export default Root;