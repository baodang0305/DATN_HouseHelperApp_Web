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
import Reward from './Reward/Reward';
import AddReward from './Reward/AddReward/AddReward';
import TaskCategory from './TaskCategory/TaskCategory';
import DataFormTaskCate from './TaskCategory/DataFormTaskCate/DataFormTaskCate';
import Grocery from './Grocery/Grocery';
import DataFormGrocery from './Grocery/DataFormGrocery/DataFormGrocery';

const Root = () => {

    return (
        <div>
            <Alert />
            <Router history={history}>
                <Switch>
                    <PrivateRoute.IsNotLogin path="/login" component={Login} />
                    <PrivateRoute.IsNotLogin path="/create-family" component={RegisterFamily} />
                    <PrivateRoute.IsNotLogin path="/create-account" component={RegisterAccount} />
                    <PrivateRoute.IsNotLogin path="/reset-password&:id" component={ResetPassword} />
                    <PrivateRoute.IsNotLogin path="/activate-account&:id" component={ActiveAccount} />

                    <PrivateRoute.IsLogin path="/tasks/edit-task">
                        <FormCreateTask type="edit"></FormCreateTask>
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin path='/tasks/add-task'>
                        <FormCreateTask type="add"></FormCreateTask>
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin path="/tasks" component={Task} />

                    <PrivateRoute.IsLogin path="/add-task-category">
                        <DataFormTaskCate type="add" />
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin path="/edit-task-category">
                        <DataFormTaskCate type="edit" />
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin path="/task-category" component={TaskCategory} />

                    <PrivateRoute.IsLogin exact path="/family" component={Family} />
                    <PrivateRoute.IsLogin exact path="/family/chat" component={Chat} />
                    <PrivateRoute.IsLogin exact path="/family/member" component={Member} />
                    <PrivateRoute.IsLogin exact path="/family/setting" component={Setting} />
                    <PrivateRoute.IsLogin exact path="/family/add-member" component={AddMember} />
                    <PrivateRoute.IsLogin exact path="/family/setting/my-account" component={MyAccount} />
                    <PrivateRoute.IsLogin exact path="/family/setting/update-family" component={UpdateFamily} />

                    <PrivateRoute.IsLogin exact path="/calendar" component={Calendar} />
                    <PrivateRoute.IsLogin exact path="/calendar/add-event">
                        <AddEvent type="add" />
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin exact path="/calendar/edit-event">
                        <AddEvent type="edit" />
                    </PrivateRoute.IsLogin>

                    <PrivateRoute.IsLogin exact path="/rewards" component={Reward} />
                    <PrivateRoute.IsLogin exact path="/rewards/add-reward" >
                        <AddReward type="add" />
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin exact path="/rewards/edit-reward" >
                        <AddReward type="edit" />
                    </PrivateRoute.IsLogin>

                    <PrivateRoute.IsLogin exact path="/groceries/add-grocery" >
                        <DataFormGrocery type="add" />
                    </PrivateRoute.IsLogin>
                    <PrivateRoute.IsLogin exact path="/grocery" component={Grocery} />

                    <PrivateRoute.IsNotLogin exact path="/" component={Home} />
                </Switch>

            </Router>
            <ToastContainer />
        </div>
    );
}

export default Root;