import React, { Component } from 'react';
import { ToastContainer } from 'react-toastify';
import { Router, Switch, Route } from 'react-router-dom';

import Alert from './Alert';
import Home from './Home/Home';
import Task from './Task/Task';
import Login from './Login/Login';
import Family from './Family/Family';
import history from '../helpers/history';
import FormCreateTask from './Task/AddTask/AddTask';
import PrivateRoute from './PrivateRoute';
import Member from './Family/Member/Member';
import Setting from './Family/Setting/Setting';
import MyAccount from './Family/MyAccount/MyAccount';
import AddMember from './Family/AddMember/AddMember';
import Chat from './Family/Chat/ChatContainer/ChatContainer';
import UpdateFamily from './Family/UpdateFamily/UpdateFamily';
import ResetPassword from './Family/ResetPassword/ResetPassword';
import RegisterFamily from './Register/RegisterFamily/RegisterFamily';
import RegisterAccount from './Register/RegisterAccount/RegisterAccount';
import { connect } from 'react-redux';
import socketIOClient from "socket.io-client";

import { alertActions } from "../actions/alert.actions";
import { taskActions } from "../actions/task.actions";
import { taskCateActions } from "../actions/task.cate.actions";
import { memberActions } from "../actions/member.actions";

let socket;
const ENDPOINT = "https://househelperapp-api.herokuapp.com";

class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "Message",
            date: "NULL",
            n: "NULL",
            connect: "NULL"
        }

    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        //Connect socket to listen to every thing changed
        const { token } = nextProps;
        console.log('', token)
        socket = socketIOClient(ENDPOINT);

        socket.on('connect', function () {
            socket.emit('authenticate', { token });
        });

        socket.on("authenticate", (res) => {
            this.setState({ connect: res.message });
        });

        //Change data of Family
        socket.on("Family", data => {
            console.log(data)
        });

        //Change data of members
        socket.on("Member", data => {
            const { getAllMembers } = this.props;
        })

        //Change data of Task
        socket.on("Task", data => {
            console.log(' DU lieu socket', data);
            if (data) {
                const { getAllTasks, getAllMembers, getAllTaskCates } = this.props;
                getAllTasks();
            }
        });

        socket.on("reminder", data => {
            console.log(data);
            this.setState({ message: data.name });
            const { remindTaskNotification } = this.props;
            remindTaskNotification(data);
        });

        socket.on("nudge", data => {
            console.log(data);
            this.setState({ n: data.message });
            const { getAndSetNotificationTask, nudgeTaskNotification } = this.props;
            getAndSetNotificationTask(data);
            nudgeTaskNotification(data);
        });
    }
    render() {
        const { connect } = this.state;
        console.log(connect);
        return (
            <div>
                <Alert />

                <Router history={history}>
                    <Switch>
                        <Route path="/login" component={Login} />
                        <Route path="/create-family" component={RegisterFamily} />
                        <Route path="/create-account" component={RegisterAccount} />
                        <Route exact path="/reset-password&:id" component={ResetPassword} />

                        <PrivateRoute path="/tasks/edit-task">
                            <FormCreateTask type="edit"></FormCreateTask>
                        </PrivateRoute>
                        <PrivateRoute path='/tasks/add-task'>
                            <FormCreateTask type="add"></FormCreateTask>
                        </PrivateRoute>
                        <PrivateRoute path="/tasks" component={Task} />

                        <PrivateRoute exact path="/family" component={Family} />
                        <PrivateRoute exact path="/family/chat" component={Chat} />
                        <PrivateRoute exact path="/family/member" component={Member} />
                        <PrivateRoute exact path="/family/setting" component={Setting} />
                        <PrivateRoute exact path="/family/add-member" component={AddMember} />
                        <PrivateRoute exact path="/family/setting/my-account" component={MyAccount} />
                        <PrivateRoute exact path="/family/setting/update-family" component={UpdateFamily} />

                        <Route exact path="/" component={Home} />
                    </Switch>
                </Router>
                <ToastContainer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    token: state.authentication.inforLogin.token,
})
const actionCreators = {
    getAllTasks: taskActions.getAllTasks,
    getAllTaskCates: taskCateActions.getAllTaskCates,
    getAllMembers: memberActions.getAllMembers,
    getAndSetNotificationTask: taskActions.getAndSetNotificationTask,
    nudgeTaskNotification: alertActions.nudgeTaskNotification,
    remindTaskNotification: alertActions.remindTaskNotification,
}
export default connect(mapStateToProps, actionCreators)(Root);