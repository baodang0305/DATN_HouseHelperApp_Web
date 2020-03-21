import apiUrlTypes from "../helpers/apiURL";
import actionTypes from "../constants/actionTypes";

function receivedMembers(json) {
    return {
        type: actionTypes.RECEIVED_MEMBERS,
        members: json
    }
}

export function fetchMembers() {
    return dispatch => {
        return fetch(`${apiUrlTypes.local}users/get-all-members`)
            .then(response => response.json())
            .then(json => {
                dispatch(receivedMembers(json));
            });
    }
}