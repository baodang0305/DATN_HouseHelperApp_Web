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
                    let listTaskCategories = res.data.listTaskCategories;
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

export const taskCateActions = {
    getAllTaskCates
}