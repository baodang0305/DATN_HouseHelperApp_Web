import apiUrlTypes from "../helpers/apiURL";
import { memberConstants } from "../constants/member.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";
import { indexConstants } from "../constants/index.constants";

const login = (email, password, remember) => {
    return dispatch => {

        dispatch(request());

        return fetch(`${apiUrlTypes.heroku}/users/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json()
            .then(data => {
                const message = data.message;
                if (data.status === "success") {
                    const inforLogin = {
                        "user": data.user,
                        "token": data.token
                    }
                    if (remember) {
                        localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                    }
                    dispatch(success(inforLogin));
                    dispatch(alertActions.success(message));
                    history.push("/family");
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(message));
                }
            })
        )
    }

    function request() { return { type: memberConstants.LOGIN_REQUEST } }
    function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } }
    function failure() { return { type: memberConstants.LOGIN_FAILURE } }
}

const logout = () => {
    localStorage.removeItem("inforLogin");
    return {
        type: memberConstants.LOGOUT
    }
}

const addMember = (userInfor) => {
    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/add-member`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${indexConstants.TOKEN_API}`
            },
            body: JSON.stringify( userInfor )
        })
        .then(response => response.json()
            .then(data => {
                if (data.status === "failed") {
                    dispatch(alertActions.error(data.message));
                } else {
                    dispatch(alertActions.success(data.message));
                }
            })
        )
    }
}

const editMember = ({ mName, mEmail, mAge, mRole, mIsAdmin, mAvatar }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/edit-member`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ mName, mEmail, mAge, mRole, mIsAdmin, mAvatar })
        })
        .then(response => response.json()
            .then(data => {
                console.log(data)
                if (data.status === "failed") {
                    dispatch(alertActions.error(data.message));
                } else {
                    dispatch(alertActions.success(data.message));
                }
            })
        )
    }
}

const changePassword = ({oldPassword, newPassword}) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    const { token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/change-password`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ oldPassword, newPassword })
        })
        .then(response => response.json()
            .then(data => {
                if (data.status === "failed") {
                    dispatch(alertActions.error(data.message));
                } else {
                    dispatch(alertActions.success(data.message));
                }
            })
        )
    }
}

export const memberActions = {
    login,
    logout,
    addMember,
    editMember,
    changePassword
}