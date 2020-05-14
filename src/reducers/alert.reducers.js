import { alertConstants } from "../constants/alert.constants";

function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.SUCCESS: {
            return {
                type: "success",
                message: action.message
            }
        }
        case alertConstants.ERROR: {
            return {
                type: "error",
                message: action.message
            }
        }
        case alertConstants.CLEAR: {
            return {};
        }
        case alertConstants.NUDGE_TASK_NOTIFICATION: {
            return {
                type: 'nudgeTaskNotification',
                message: action.data.message,
                data: action.data.task
            }
        }
        case alertConstants.REMIND_TASK_NOTIFICATION: {
            return {
                type: 'remindTaskNotification',
                message: "Có công việc cần thực hiện",
                data: action.data
            }
        }
        case alertConstants.REMIND_EVENT_NOTIFICATION: {
            return {
                type: 'remindEventNotification',
                message: action.data.message
            }
        }
        default: return state;
    }
}

export default alert;