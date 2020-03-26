import apiUrlTypes from "../helpers/apiURL";
import actionTypes from "../constants/actionTypes";

function receivedMembers(members) {
    return {
        type: actionTypes.RECEIVED_MEMBERS,
        members
    }
}

export function getAllMembers() {
    return dispatch => {
        return fetch(`${apiUrlTypes.local}/users/get-all-members`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(members => {
            dispatch(receivedMembers(members));
        });
    }
}