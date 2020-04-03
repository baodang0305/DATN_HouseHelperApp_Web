import apiUrlTypes from "../helpers/apiURL";
import { memberConstants } from "../constants/member.constants";
import { alertActions } from "../actions/alert.actions";
import history from "../helpers/history";

const login = (email, password) => {
    return dispatch => {

        dispatch(request());

        return fetch(`${apiUrlTypes.heroku}/users/login`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(response => response.json()
                .then(data => {
                    const message = data.message;
                    if (response.status === 200) {
                        const user = {
                            member: data.user,
                            token: data.token
                        }
                        localStorage.setItem("user", JSON.stringify(user));
                        dispatch(success(user));
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
    function success(user) { return { type: memberConstants.LOGIN_SUCCESS, user } }
    function failure() { return { type: memberConstants.LOGIN_FAILURE } }
}

export const memberActions = {
    login,
}