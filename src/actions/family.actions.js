import history from "../helpers/history";
import apiUrlTypes from "../helpers/apiURL";
import { alertActions } from "./alert.actions";
import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";

const createFamily = (inforCreate) => {

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/users/register-family`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(inforCreate)
        })
            .then(response => response.json()
                .then(data => {
                    const { message, status } = data;
                    if (status === "failed") {
                        dispatch(failure(message));
                        dispatch(alertActions.error(message));
                    } else {
                        history.push("/login");
                        dispatch(success(message));
                        dispatch(alertActions.success(message));
                    }
                })
            );
    }

    function success(message) { return { type: familyConstants.CREATE_FAMILY_SUCCESS, message } };
    function failure(message) { return { type: familyConstants.CREATE_FAMILY_FAILURE, message } };
}

const getAllMembers = () => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { user, token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/list-member`, {
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json()
                .then(data => {
                    dispatch(success(data.listMembers));
                })
            );
    }
    function success(members) { return { type: memberConstants.GET_ALL_MEMBERS, members } }
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
                    inforLogin.user = {...inforLogin.user, fName, fImage }
                    console.log(inforLogin)
                    localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                    dispatch(success(inforLogin));
                    history.push("/family/setting");
                } else {
                    dispatch(alertActions.error(data.message));
                }
            })

        )

    }

    function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin }};
}

const changePasswordFamily = ({ oldPassword, newPassword }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/change-family-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ oldPassword, newPassword })
        })
        .then( response => response.json()
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

const resetFamilyPassword = ({ fPassword, mID }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/recover-family-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}`},
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

export const familyActions = {
    createFamily,
    updateFamily,
    getAllMembers,
    resetFamilyPassword,
    changePasswordFamily
}