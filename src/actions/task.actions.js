import apiUrlTypes from "../helpers/apiURL";
import token from '../helpers/token'
import { taskConstants } from "../constants/task.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import axios from 'axios';




const deleteTask = (idTask) => {
    return dispatch => {

        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/delete-task`, { id: idTask }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));
                    history.push("/tasks");
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }

            )

    }
    function request() { return { type: taskConstants.deleteTaskConstants.DELETE_REQUEST } }
    function success() { return { type: taskConstants.deleteTaskConstants.DELETE_SUCCESS } }
    function failure() { return { type: taskConstants.deleteTaskConstants.DELETE_FAILURE } }
}

const completeTask = (idTask, memberComplete) => {
    return dispatch => {

        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/complete-task`, { tID: idTask, mIDComplete: memberComplete }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));
                    history.push("/tasks");
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }

            )

    }
    function request() { return { type: taskConstants.completeTaskConstants.COMPLETE_REQUEST } }
    function success() { return { type: taskConstants.completeTaskConstants.COMPLETE_SUCCESS } }
    function failure() { return { type: taskConstants.completeTaskConstants.COMPLETE_FAILURE } }
}


const addTask = (name, assign, date, photo, time, points, tcID, notes) => {
    return dispatch => {

        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/add-task`, { name, assign, date, photo, time, points, tcID, notes }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));

                    history.push("/tasks");
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }

            )

    }
    function request() { return { type: taskConstants.addTaskConstants.ADD_TASK_REQUEST } }
    function success() { return { type: taskConstants.addTaskConstants.ADD_TASK_SUCCESS } }
    function failure() { return { type: taskConstants.addTaskConstants.ADD_TASK_FAILURE } }
}


const getRecentTask = recentTask => {
    return {
        type: taskConstants.getRecentTaskConstants.GET_RECENT_TASK,
        recentTask
    }
}


const dismissTask = (idTask) => {
    return dispatch => {

        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/skip-task`, { tID: idTask }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));
                    history.push("/tasks");
                }
                else {
                    dispatch(alertActions.error(message));
                }
            }

            )

    }
    function request() { return { type: taskConstants.dismissTaskConstants.DISMISS_REQUEST } }
    function success() { return { type: taskConstants.dismissTaskConstants.DISMISS_SUCCESS } }
}

const checkTaskToRemind = (taskNeedRemind) => {
    return {
        type: taskConstants.checkTaskToRemindConstants.CHECK_TASK_TO_REMIND,
        taskNeedRemind
    }
}
export const taskActions = {
    deleteTask,
    completeTask,
    addTask,
    getRecentTask,
    dismissTask,
    checkTaskToRemind
}
