import axios from "axios";
import apiUrlTypes from "../helpers/apiURL";
import { rewardConstants } from "../constants/reward.constants";
import { alertActions } from "./alert.actions";
import history from "../helpers/history";
import { memberConstants } from "../constants/member.constants";

const getListRewards = () => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        axios.get(`${apiUrlTypes.heroku}/list-reward`, { headers: { "Authorization": `Bearer ${inforLogin.token}` } })
            .then(response => {
                if (response.data.status === "success") {
                    dispatch(success(response.data.listRewards));

                } else {
                    dispatch(failure());
                }
            })
    }

    function request() { return { type: rewardConstants.GET_LIST_REWARDS_REQUEST } }
    function success(listRewards) { return { type: rewardConstants.GET_LIST_REWARDS_SUCCESS, listRewards } }
    function failure() { return { type: rewardConstants.GET_LIST_REWARDS_FAILURE } }
}

const addReward = ({ name, points, assign }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return axios.post(`${apiUrlTypes.heroku}/add-reward`, { name, points, assign }, {
            headers: {
                'Authorization': `Bearer ${inforLogin.token}`
            }
        })
            .then(response => {
                if (response.data.status === "success") {
                    dispatch(success());
                    dispatch(alertActions.success(response.data.message));
                    history.push("/rewards")
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(response.data.message));
                }
            })
    }
    function request() { return { type: rewardConstants.ADD_REWARD_REQUEST } }
    function success() { return { type: rewardConstants.ADD_REWARD_SUCCESS } }
    function failure() { return { type: rewardConstants.ADD_REWARD_FAILURE } }
}

const editReward = ({ rID, name, points, assign }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request())
        return axios.post(`${apiUrlTypes.heroku}/edit-reward`, { rID, name, points, assign },
            {
                headers: {
                    'Authorization': `Bearer ${inforLogin.token}`
                }

            }
        )
            .then(response => {
                if (response.data.status === "success") {
                    dispatch(success());
                    dispatch(alertActions.success(response.data.message));
                    history.push("/rewards")
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(response.data.message));
                }
            })
    }

    function request() { return { type: rewardConstants.EDIT_REWARD_REQUEST } }
    function success() { return { type: rewardConstants.EDIT_REWARD_SUCCESS } }
    function failure() { return { type: rewardConstants.EDIT_REWARD_FAILURE } }
}

const deleteReward = ({ rID }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return axios.post(`${apiUrlTypes.heroku}/delete-reward`, { rID },
            {
                headers: { 'Authorization': `Bearer ${inforLogin.token}` }
            }
        )
            .then(response => {
                if (response.data.status === "success") {
                    dispatch(success());
                    dispatch(alertActions.success(response.data.message));
                    history.push("/rewards");
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(response.data.message));
                }
            })
    }
    function request() { return { type: rewardConstants.DELETE_REWARD_REQUEST } }
    function success() { return { type: rewardConstants.DELETE_REWARD_SUCCESS } }
    function failure() { return { type: rewardConstants.DELETE_REWARD_FAILURE } }
}

const claimReward = ({ reward }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return axios.post(`${apiUrlTypes.heroku}/claim-reward`, { rID: reward._id }, {
            headers: { "Authorization": `Bearer ${inforLogin.token}` }
        })
            .then(response => {
                if (response.data.status === "success") {
                    if (inforLogin.user.mPoints >= reward.points) {
                        inforLogin.user.mPoints = inforLogin.user.mPoints - reward.points;
                        localStorage.removeItem("inforLogin");
                        localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                        dispatch(updateInforLogin(inforLogin))
                    }
                    dispatch(success());
                    dispatch(alertActions.success(response.data.message));
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(response.data.message));
                }
            })
    }
    function request() { return { type: rewardConstants.CLAIM_REWARD_REQUEST } }
    function success() { return { type: rewardConstants.CLAIM_REWARD_SUCCESS } }
    function failure() { return { type: rewardConstants.CLAIM_REWARD_FAILURE } }
    function updateInforLogin(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } }
}

const getListHistoryReward = () => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return axios.get(`${apiUrlTypes.heroku}/list-history-reward`, { headers: { "Authorization": `Bearer ${inforLogin.token}` } })
            .then(response => {
                if (response.data.status === "success") {
                    dispatch(success(response.data.listHistoryReward));
                } else {
                    dispatch(failure());
                }
            })
    }
    function request() { return { type: rewardConstants.GET_LIST_HISTORY_REWARDS_REQUEST } }
    function success(listHistoryReward) { return { type: rewardConstants.GET_LIST_HISTORY_REWARDS_SUCCESS, listHistoryReward } }
    function failure() { return { type: rewardConstants.GET_LIST_HISTORY_REWARDS_FAILURE } }
}

const followReward = ({ rID }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return axios.post(`${apiUrlTypes.heroku}/follow-reward`, { rID }, {
            headers: { 'Authorization': `Bearer ${inforLogin.token}` }
        })
            .then(response => {
                const { data } = response;
                if (data.status === "success") {
                    dispatch(success());
                    dispatch(alertActions.success(data.message));
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(data.message));
                }
            })
    }
    function request() { return { type: rewardConstants.FOLLOW_REWARD_REQUEST } }
    function success() { return { type: rewardConstants.FOLLOW_REWARD_SUCCESS } }
    function failure() { return { type: rewardConstants.FOLLOW_REWARD_FAILURE } }
}

const deleteAllRewardsReceived = () => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/reset-history-reward`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${inforLogin.token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    dispatch(success());
                    dispatch(alertActions.success(data.message));
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(data.message));
                }
            })
    }
    function request() { return { type: rewardConstants.DELETE_ALL_REWARDS_RECEIVED_REQUEST } }
    function success() { return { type: rewardConstants.DELETE_ALL_REWARDS_RECEIVED_SUCCESS } }
    function failure() { return { type: rewardConstants.DELETE_ALL_REWARDS_RECEIVED_FAILURE } }
}

export const rewardActions = {
    getListRewards,
    addReward,
    editReward,
    deleteReward,
    claimReward,
    getListHistoryReward,
    followReward,
    deleteAllRewardsReceived,
}