import history from "../helpers/history";
import apiUrlTypes from "../helpers/apiURL";
import { alertActions } from "../actions/alert.actions";
import { memberConstants } from "../constants/member.constants";

const login = (email, password, remember) => {

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/users/login`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(response => response.json()
                .then(data => {
                    const message = data.message;
                    if (data.status === "success") {
                        const inforLogin = { "user": data.user, "token": data.token }
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
    function failure() { return { type: memberConstants.LOGIN_FAILURE } }
    function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } }
}

const logout = () => {
    localStorage.removeItem("inforLogin");
    history.push("/login");
    return { type: memberConstants.LOGOUT }
}

const addMember = (userInfor) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/add-member`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
            body: JSON.stringify(userInfor)
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "failed") {
                        dispatch(failure());
                        dispatch(alertActions.error(data.message));
                    } else {
                        dispatch(success());
                        history.push("/family");
                        dispatch(alertActions.success(data.message));
                    }
                })
            )
    }

    function request() { return { type: memberConstants.ADD_MEMBER_REQUEST } }
    function success() { return { type: memberConstants.ADD_MEMBER_SUCCESS } }
    function failure() { return { type: memberConstants.ADD_MEMBER_FAILURE } }

}

const editMember = ({ mName, mEmail, mAge, mRole, mIsAdmin, mAvatar, isSetPass, member, fromSetting }) => {

    let mID = null;
    let isChanges = false;
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    if (
        member.mAge !== mAge ||
        member.mRole !== mRole ||
        member.mName !== mName ||
        member.mEmail !== mEmail ||
        member.mIsAdmin !== mIsAdmin ||
        member.mAvatar.image !== mAvatar.image ||
        member.mAvatar.color !== mAvatar.color
    ) { isChanges = true; }

    if (member.mEmail !== inforLogin.user.mEmail) {
        mID = member._id;
    }

    if (isChanges) {
        return dispatch => {
            return fetch(`${apiUrlTypes.heroku}/edit-member`, {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
                body: JSON.stringify({ mID, mName, mEmail, mAge, mRole, mIsAdmin, mAvatar })
            })
                .then(response => response.json()
                    .then(data => {
                        if (data.status === "failed") {
                            dispatch(alertActions.error(data.message));
                        } else {
                            if (inforLogin.user.mEmail === member.mEmail) {
                                localStorage.removeItem("inforLogin");
                                inforLogin.user = { ...inforLogin.user, mName, mEmail, mRole, mAge, mIsAdmin, mAvatar }

                                localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                                dispatch(success(inforLogin));
                            }
                            dispatch(alertActions.success(data.message));
                            if (fromSetting) {
                                history.push("/family/setting");
                            } else {
                                const memberTemp = { "_id": member._id, mName, mEmail, mAge, mAvatar, mRole, mIsAdmin }
                                history.push({ pathname: "/family/member", search: `?id=${member._id}`, state: { "member": memberTemp } });
                            }
                        }
                    })
                )
        }

        function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } }

    } else {
        if (!isSetPass) {
            return dispatch => {
                dispatch(alertActions.error("No changes have been made"));
            }
        } else {
            return dispatch => {
                dispatch(alertActions.clear());
            }
        }
    }
}

const changePassword = ({ oldPassword, newPassword }) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/change-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
            body: JSON.stringify({ oldPassword, newPassword })
        })
            .then(response => response.json()
                .then(data => {
                    if (data.status === "failed") {
                        dispatch(failure());
                        dispatch(alertActions.error(data.message));
                    } else {
                        dispatch(success());
                        dispatch(alertActions.success(data.message));
                    }
                })
            )
    }

    function request() { return { type: memberConstants.CHANGE_PASSWORD_REQUEST } };
    function success() { return { type: memberConstants.CHANGE_PASSWORD_SUCCESS } };
    function failure() { return { type: memberConstants.CHANGE_PASSWORD_FAILURE } };

}

const deleteMember = (mID) => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/delete-member`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
            body: JSON.stringify({ mID })
        })
            .then(response => response.json()
                .then(data => {

                    if (data.status === "success") {
                        if (inforLogin.user._id === mID || !mID) {
                            dispatch(logout());
                        } else {
                            history.push("/family")
                        }
                        dispatch(alertActions.success(data.message));
                    } else {
                        dispatch(alertActions.error(data.message));
                    }
                })
            )
    }
}

const requestResetPassword = ({ email, type }) => {

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/users/request-reset-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ email, type })
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

const resetPassword = ({ newPassword, rpID }) => {

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/users/reset-password`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ newPassword, rpID })
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

    function request() { return { type: memberConstants.RESET_PASSWORD_REQUEST } };
    function success() { return { type: memberConstants.RESET_PASSWORD_SUCCESS } };
    function failure() { return { type: memberConstants.RESET_PASSWORD_FAILURE } };

}

const updateInforFamilyOfUser = () => {

    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/get-family`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${inforLogin.token}` }
        })
            .then(response => response.json()
                .then(data => {
                    console.log(data)
                    if (data.status === "success") {
                        localStorage.removeItem("inforLogin");
                        inforLogin.user = { ...inforLogin.user, "fName": data.familyInfo.fName, "fImage": data.familyInfo.fImage }
                        localStorage.setItem("inforLogin", JSON.stringify(inforLogin));
                        dispatch(success(inforLogin));
                    }
                })
            )
    }
    function success(inforLogin) { return { type: memberConstants.LOGIN_SUCCESS, inforLogin } }
}

const deleteNew = ({ nID }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    console.log(nID)
    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/delete-news`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json", "Authorization": `Bearer ${inforLogin.token}` },
            body: JSON.stringify({ nID })
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

export const memberActions = {
    login,
    logout,
    addMember,
    deleteNew,
    editMember,
    deleteMember,
    resetPassword,
    changePassword,
    requestResetPassword,
    updateInforFamilyOfUser
}