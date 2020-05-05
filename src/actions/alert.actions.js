import { alertConstants } from "../constants/alert.constants";

function success(message) {
    return {
        type: alertConstants.SUCCESS,
        message
    }
}

function error(message) {
    return {
        type: alertConstants.ERROR,
        message
    }
}

function clear() {
    return {
        type: alertConstants.CLEAR
    }
}

function nudgeTaskNotification(data) {
    return {
        type: alertConstants.NUDGE_TASK_NOTIFICATION,
        data
    }
}

function remindTaskNotification(data) {
    return {
        type: alertConstants.REMIND_TASK_NOTIFICATION,
        data
    }
}
export const alertActions = {
    success,
    error,
    clear,
    nudgeTaskNotification,
    remindTaskNotification
}