import apiUrlTypes from "../helpers/apiURL";
import { alertActions } from "./alert.actions";
import { indexConstants } from "../constants/index.constants";
import { memberConstants } from "../constants/member.constants";
import { familyConstants } from "../constants/family.constants";
import history from "../helpers/history";


const createFamily = (inforCreate) => {
    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/users/register-family`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${indexConstants.TOKEN_API}` 
            },
            body: JSON.stringify( inforCreate )
        })
        .then(response => response.json()
            .then(data => {
                const { message, status } = data;
                if (status === "failed") {
                    dispatch(failure(message));
                    dispatch(alertActions.error(message));
                } else {
                    dispatch(success(message));
                    dispatch(alertActions.success(message));
                    history.push("/login");
                    dispatch(alertActions.clear());
                }

            })
        );
    }

    function success(message) { return { type: familyConstants.CREATE_FAMILY_SUCCESS, message }};
    function failure(message) { return { type: familyConstants.CREATE_FAMILY_FAILURE, message }};
}

const getAllMembers = () => {
    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/list-member`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${memberConstants.TOKEN_API}` 
            }
        })
        .then(response => response.json()
            .then(data => {
                dispatch(success(data.listMembers));
            })
        );
    }

    function success(members) { return { type: memberConstants.GET_ALL_MEMBERS, members}}
}

export const familyActions = {
    createFamily,
    getAllMembers
}