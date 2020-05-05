import apiUrlTypes from "../helpers/apiURL";

import { taskConstants } from "../constants/task.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import axios from 'axios';
import { indexConstants } from "../constants/index.constants";
import { message } from "antd";



const getAllTasks = () => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.get(`${apiUrlTypes.heroku}/list-task`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success(res.data.listTasks));
                }
                else {
                    dispatch(alertActions.error(message));
                }
            }

            )

    }
    function request() { return { type: taskConstants.getAllTasks.GET_ALL_TASKS_REQUEST } }
    function success(allTasks) { return { type: taskConstants.getAllTasks.GET_ALL_TASKS_SUCCESS, allTasks } }

}

const deleteTask = (idTask) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
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
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
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


const addTask = (name, assign, dueDate, photo, time, points, tcID, notes, penalty, repeat, reminder) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/add-task`, { name, assign, dueDate, photo, time, points, tcID, notes, penalty, repeat, reminder }, {
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
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
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


const editTask = (_id, name, time, points, assign, photo, tcID, notes, dueDate, penalty, repeat, reminder) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/edit-task`, { _id, name, time, points, assign, photo, tcID, notes, dueDate, penalty, repeat, reminder }, {
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
    function request() { return { type: taskConstants.editTaskConstants.EDIT_TASK_REQUEST } }
    function success() { return { type: taskConstants.editTaskConstants.EDIT_TASK_SUCCESS } }
    function failure() { return { type: taskConstants.editTaskConstants.EDIT_TASK_FAILURE } }
}
const redoTask = (tID) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/redo-task`, { tID: tID }, {
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
    function request() { return { type: taskConstants.redoTaskConstants.REDO_REQUEST } }
    function success() { return { type: taskConstants.redoTaskConstants.REDO_SUCCESS } }
}

const assignTask = (tID) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/assign-task`, { tID: tID }, {
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
                    dispatch(failure());
                }
            }

            )

    }
    function request() { return { type: taskConstants.assignTaskConstants.ASSIGN_REQUEST } }
    function success() { return { type: taskConstants.assignTaskConstants.ASSIGN_SUCCESS } }
    function failure() { return { type: taskConstants.assignTaskConstants.ASSIGN_FAILURE } }
}

const nudgeTask = (tID, members) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(`${apiUrlTypes.heroku}/nudge-task`, { tID: tID, list: members }, {
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
    function request() { return { type: taskConstants.nudgeTaskConstants.NUDGE_TASK_REQUEST } }
    function success() { return { type: taskConstants.nudgeTaskConstants.NUDGE_TASK_SUCCESS } }
}

const getAndSetNotificationTask = (data) => {
    return { type: taskConstants.getAndSetNotificationTask.GET_SET_NOTIFICATION_TASK, data }
}
export const taskActions = {
    getAllTasks,
    deleteTask,
    completeTask,
    addTask,
    editTask,
    getRecentTask,
    dismissTask,
    redoTask,
    assignTask,
    nudgeTask,
    getAndSetNotificationTask
}
