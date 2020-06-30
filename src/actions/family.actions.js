import axios from 'axios';
import history from "../helpers/history";
import apiUrlTypes from "../helpers/apiURL";
import { alertActions } from "./alert.actions";
import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";

const createFamily = ({ fName, fPassword, fImage, mName, mEmail, mAvatar, mAge, mRole }) => {
    return dispatch => {
        dispatch(request());
        return axios.post(`${apiUrlTypes.heroku}/users/register-family`, { fName, fPassword, fImage, mAvatar, mName, mEmail, mAge, mRole })
            .then(response => {
                const { message, status } = response.data;
                if (status === "failed") {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                } else {
                    dispatch(success());
                    history.push("/login");
                    dispatch(alertActions.success(message));
                }
            })

    }

    function request() { return { type: familyConstants.CREATE_FAMILY_REQUEST } };
    function success() { return { type: familyConstants.CREATE_FAMILY_SUCCESS } };
    function failure() { return { type: familyConstants.CREATE_FAMILY_FAILURE } };
}

const activeAccount = ({ code, aaID }) => {

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/users/activate-account`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ code, aaID })
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(success());
                        history.push("/login");
                        dispatch(alertActions.success(data.message));
                    } else {
                        dispatch(failure());
                        dispatch(alertActions.error(data.message));
                    }
                })
            )
    }

    function request() { return { type: familyConstants.ACTIVE_ACCOUNT_REQUEST } }
    function failure() { return { type: familyConstants.ACTIVE_ACCOUNT_FAILURE } }
    function success() { return { type: familyConstants.ACTIVE_ACCOUNT_SUCCESS } }
}

const updateFamily = ({ fName, fImage }) => {

    let inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { user, token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/edit-family`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ fName, fImage })
        })

            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(alertActions.success(data.message));
                        localStorage.removeItem("inforLogin");
                        inforLogin.user = { ...inforLogin.user, fName, fImage }
                        localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                        dispatch(success(inforLogin));
                        history.push("/family/setting");
                    } else {
                        dispatch(alertActions.error(data.message));
                    }
                })

            )

    }

    function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } };
}

const changePasswordFamily = ({ oldPassword, newPassword }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { token } = inforLogin;

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/change-family-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ oldPassword, newPassword })
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(success());
                        dispatch(alertActions.success(data.message));
                    } else {
                        dispatch(failure());
                        dispatch(alertActions.error(data.message));
                    }
                })
            )
    }

    function request() { return { type: familyConstants.CHANGE_FAMILY_PASSWORD_REQUEST } };
    function success() { return { type: familyConstants.CHANGE_FAMILY_PASSWORD_SUCCESS } };
    function failure() { return { type: familyConstants.CHANGE_FAMILY_PASSWORD_FAILURE } }

}

const resetFamilyPassword = ({ fPassword, mID }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/recover-family-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
            body: JSON.stringify({ fPassword, mID })
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(alertActions.success(data.message));
                    } else {
                        dispatch(alertActions.error(data.message));
                    }
                })
            )
    }
}

const getListMembers = () => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/list-member`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${inforLogin.token}` }
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(success(data.listMembers));
                    } else {
                        dispatch(failure());
                    }
                })
            );
    }

    function request() { return { type: familyConstants.GET_LIST_MEMBERS_REQUEST } };
    function failure() { return { type: familyConstants.GET_LIST_MEMBERS_FAILURE } };
    function success(listMembers) { return { type: familyConstants.GET_LIST_MEMBERS_SUCCESS, listMembers } };

}

const getListNews = () => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/list-news`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${inforLogin.token}` }
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "success") {
                        dispatch(success(data.listNews));
                    } else {
                        dispatch(failure());
                    }
                })
            )
    }

    function request() { return { type: familyConstants.GET_LIST_NEWS_REQUEST } };
    function success(listNews) { return { type: familyConstants.GET_LIST_NEWS_SUCCESS, listNews } };
    function failure() { return { type: familyConstants.GET_LIST_NEWS_FAILURE } };

}

export const familyActions = {
    getListNews,
    createFamily,
    updateFamily,
    activeAccount,
    getListMembers,
    resetFamilyPassword,
    changePasswordFamily
}