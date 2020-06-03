import apiUrlTypes from "../helpers/apiURL";

import { taskCateConstants } from "../constants/task.cate.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import axios from 'axios';

const getAllTaskCates = () => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.get(
            'https://househelperapp-api.herokuapp.com/list-task-category', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    const listTaskCategories = res.data.listTaskCategories;
                    if (listTaskCategories.findIndex(item => item.name === 'Phổ biến') !== -1) {
                        let indexCommonTaskCate = listTaskCategories.findIndex(item => item.name === 'Phổ biến');
                        let idCommonTaskCate = listTaskCategories[indexCommonTaskCate]._id;
                        let tempList = listTaskCategories;
                        if (indexCommonTaskCate !== -1) {
                            let temp = tempList[0];
                            tempList[0] = tempList[indexCommonTaskCate];
                            tempList[indexCommonTaskCate] = temp;
                        }
                        dispatch(success(tempList, idCommonTaskCate));
                    }
                    else {
                        dispatch(success(res.data.listTaskCategories, null))
                    }
                }
                else {
                    dispatch(alertActions.error(message));
                    dispatch(failure())
                }
            }

            )

    }
    function request() { return { type: taskCateConstants.taskCateRequest.TASK_CATE_REQUEST } }
    function success(allTaskCates, idCommonTaskCate) {
        return { type: taskCateConstants.getAllTaskCate.GET_ALL_TASK_CATE_SUCCESS, allTaskCates, idCommonTaskCate }
    }
    function failure() { return { type: taskCateConstants.taskCateFailure.TASK_CATE_FAILURE } }
}

const addTaskCate = (name, image) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/add-task-category', { name, image }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    dispatch(success());
                    dispatch(alertActions.success(message));
                    history.push("/task-category");
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: taskCateConstants.taskCateRequest.TASK_CATE_REQUEST } }
    function success() {
        return { type: taskCateConstants.addTaskCate.ADD_TASK_CATE_SUCCESS }
    }
    function failure() { return { type: taskCateConstants.taskCateFailure.TASK_CATE_FAILURE } }
}

const editTaskCate = (tcID, name, image) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/edit-task-category', { tcID, name, image }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-task-category', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.listTaskCategories));
                            dispatch(alertActions.success(message));
                            history.push("/task-category");
                        })

                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: taskCateConstants.taskCateRequest.TASK_CATE_REQUEST } }
    function success(dataTaskCates) {
        return { type: taskCateConstants.editTaskCate.EDIT_TASK_CATE_SUCCESS, dataTaskCates }
    }
    function failure() { return { type: taskCateConstants.taskCateFailure.TASK_CATE_FAILURE } }
}


const deleteTaskCate = (tcIDDelete, tcIDReplace) => {
    return dispatch => {
        const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
        const { token } = inforLogin;
        dispatch(request());

        return axios.post(
            'https://househelperapp-api.herokuapp.com/delete-task-category', { tcIDDelete, tcIDReplace }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const message = res.data.message;
                if (res.data.status === 'success') {
                    axios.get(
                        'https://househelperapp-api.herokuapp.com/list-task-category', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                        .then(res => {
                            dispatch(success(res.data.listTaskCategories));
                            dispatch(alertActions.success(message));
                        })

                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            }
            )
    }
    function request() { return { type: taskCateConstants.taskCateRequest.TASK_CATE_REQUEST } }
    function success(dataTaskCates) {
        return { type: taskCateConstants.deleteTaskCate.DELETE_TASK_CATE_SUCCESS, dataTaskCates }
    }
    function failure() { return { type: taskCateConstants.taskCateFailure.TASK_CATE_FAILURE } }
}

export const taskCateActions = {
    getAllTaskCates,
    addTaskCate,
    editTaskCate,
    deleteTaskCate
}