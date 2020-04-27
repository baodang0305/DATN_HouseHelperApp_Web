import apiUrlTypes from "../helpers/apiURL";
import { indexConstants } from "../constants/index.constants";

const getListTasks = () => {

    const inforLogin =  JSON.parse(localStorage.getItem("inforLogin"));
    const { token } = inforLogin;

    return dispatch => {
        return fetch(`${apiUrlTypes.heroku}/list-task`,{
            method: "GET",
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json()
            .then(data => {
                if (data.status === "success") {
                    dispatch(success(data.listTasks));
                }
            })
        )
    }

    function success(listTasks) { return { type: indexConstants.GET_LIST_TASKS, listTasks }}

}

const getNumberOfIncomingMessages = (user) => {

    return dispatch => {
        return fetch(`${indexConstants.ENPOINT_SOCKET}get-number-of-incoming-messages`, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({ user })
        })
            .then(response => response.json()
                .then(data => {
                    dispatch(success(data.number));
                })
            )
    }

    function success(number) { return { type: indexConstants.NUMBER_OF_INCOMING_MESSAGES, number } }
}

export const indexActions = {
    getListTasks,
    getNumberOfIncomingMessages
}