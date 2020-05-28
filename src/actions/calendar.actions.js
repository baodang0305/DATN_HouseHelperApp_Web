import history from "../helpers/history";
import apiUrlTypes from "../helpers/apiURL";
import { alertActions } from "./alert.actions";
import { calendarConstants } from "../constants/calendar.constants";

const getListEvents = ({month, year}) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
    return dispatch => {
        dispatch(request())
        return fetch(`${apiUrlTypes.heroku}/list-event`, {
            method: "POST",
            headers: { 
                "Accept": "application/json", 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${inforLogin.token}`
            },
            body: JSON.stringify({ month, year })
        }) 
        .then(response => response.json()
            .then(data => {
                if (data.status === "success") {
                    dispatch(success(data.list));
                } else {
                    dispatch(failure());
                }
            })
        )
    }
    function request() { return { type: calendarConstants.GET_LIST_EVENTS_REQUEST } }
    function success(listCalendar) { return { type: calendarConstants.GET_LIST_EVENTS_SUCCESS, listCalendar } }
    function failure() { return { type: calendarConstants.GET_LIST_EVENTS_FAILURE } }
}

const addEvent = ({ name, assign, dateTime, reminder, repeat, photo, notes }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/add-event`, {
            method: "POST",
            headers: { 
                "Accept": "application/json", 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${inforLogin.token}`
            },
            body: JSON.stringify({ name, assign, dateTime, reminder, repeat, photo, notes })
        })
        .then(response => response.json()
            .then(data => {
                if (data.status === "success") {
                    dispatch(success());
                    history.push("/calendar");
                    dispatch(alertActions.success(data.message));
                } else {
                    dispatch(failure());
                    dispatch(alertActions.error(data.message));
                }
            })
        )
    }
    function request() { return {type: calendarConstants.ADD_EVENT_REQUEST} }
    function success() { return {type: calendarConstants.ADD_EVENT_SUCCESS} }
    function failure() { return {type: calendarConstants.ADD_EVENT_FAILURE} }
}

const editEvent = ({ _id, name, assign, dateTime, reminder, repeat, photo, notes }) => {
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/edit-event`, {
            method: "POST",
            headers: { 
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${inforLogin.token}`
            },
            body: JSON.stringify({ _id, name, assign, dateTime, reminder, repeat, photo, notes })
        })
        .then(response => response.json()
            .then(data => {
                if (data.status === "success") {
                    dispatch(success());
                    history.push("/calendar");
                    dispatch(alertActions.success(data.message));
                }
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(data.message));
                }
            })
        )
    }
    function request() { return { type: calendarConstants.EDIT_EVENT_REQUEST } }
    function success() { return { type: calendarConstants.EDIT_EVENT_SUCCESS } }
    function failure() { return { type: calendarConstants.EDIT_EVENT_FAILURE } }
}

const deleteEvent = ({ eID }) => {
    
    const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));

    return dispatch => {
        dispatch(request());
        return fetch(`${apiUrlTypes.heroku}/delete-event`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${inforLogin.token}`
            },
            body: JSON.stringify({ eID })
        })
        .then(response => response.json()
            .then(data => {
                if(data.status === "success") {
                    dispatch(success());
                    history.push("/calendar");
                    dispatch(alertActions.success(data.message));
                } 
                else {
                    dispatch(failure());
                    dispatch(alertActions.error(data.message));
                }
            })
        )
    }
    function request() { return { type: calendarConstants.DELETE_EVENT_REQUEST } }
    function success() { return { type: calendarConstants.DELETE_EVENT_SUCCESS } }
    function failure() { return { type: calendarConstants.DELETE_EVENT_FAILURE } }
}

const startRemindEventNotification = () => {
    return { type: calendarConstants.START_REMIND_EVENT_NOTIFICATION }
}

const stopRemindEventNotification = () => {
    return { type: calendarConstants.STOP_REMIND_EVENT_NOTIFICATION }
}

export const calendarActions = {
    addEvent,
    editEvent,
    deleteEvent,
    getListEvents,
    stopRemindEventNotification,
    startRemindEventNotification,
}
