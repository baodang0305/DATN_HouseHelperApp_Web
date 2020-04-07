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


const Root = () => {
    return (
        <div>
            <Alert />

            <Router history={history}>
                <Switch>
                    <Route path="/login" component={Login} />

                    <Route path="/edit-task" component={FormEditTask} />
                    <Route path='/tasks/add-task' component={FormCreateTask} />
                    <Route path="/create-family" component={RegisterFamily} />
                    <Route path="/create-account" component={RegisterAccount} />
                    <Route path="/tasks" component={Task} />

                    <Route path="/family/add-member" component={AddMember} />
                    <Route path="/family/chat" component={Chat} />
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