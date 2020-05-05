const getAllTasks = {
    GET_ALL_TASKS_REQUEST: "GET_ALL_TASKS_REQUEST",
    GET_ALL_TASKS_SUCCESS: "GET_ALL_TASKS_SUCCESS"

}

const addTaskConstants = {
    ADD_TASK_REQUEST: "ADD_TASK_REQUEST",
    ADD_TASK_SUCCESS: "ADD_TASK_SUCCESS",
    ADD_TASK_FAILURE: "ADD_TASK_FAILURE",
}
const editTaskConstants = {
    EDIT_TASK_REQUEST: "EDIT_TASK_REQUEST",
    EDIT_TASK_SUCCESS: "EDIT_TASK_SUCCESS",
    EDIT_TASK_FAILURE: "EDIT_TASK_FAILURE",
}

const completeTaskConstants = {
    COMPLETE_REQUEST: "COMPLETE_REQUEST",
    COMPLETE_SUCCESS: "COMPLETE_SUCCESS",
    COMPLETE_FAILURE: "COMPLETE_FAILURE",
}


const deleteTaskConstants = {
    DELETE_REQUEST: "DELETE_REQUEST",
    DELETE_SUCCESS: "DELETE_SUCCESS",
    DELETE_FAILURE: "DELETE_FAILURE",
}

const dismissTaskConstants = {
    DISMISS_REQUEST: "DISMISS_REQUEST",
    DISMISS_SUCCESS: "DISMISS_SUCCESS",
    DISMISS_FAILURE: "DISMISS_FAILURE",
}

const redoTaskConstants = {
    REDO_REQUEST: "REDO_REQUEST",
    REDO_SUCCESS: "REDO_SUCCESS",
    REDO_FAILURE: "REDO_FAILURE",
}

const assignTaskConstants = {
    ASSIGN_REQUEST: "ASSIGN_REQUEST",
    ASSIGN_SUCCESS: "ASSIGN_SUCCESS",
    ASSIGN_FAILURE: "ASSIGN_FAILURE",

}

const getRecentTaskConstants = {
    GET_RECENT_TASK: "GET_RECENT_TASK"
}


const checkTaskToRemindConstants = {
    CHECK_TASK_TO_REMIND: "CHECK_TASK_TO_REMIND"
}

const nudgeTaskConstants = {
    NUDGE_TASK_REQUEST: "NUDGE_TASK_REQUEST",
    NUDGE_TASK_SUCCESS: "NUDGE_TASK_SUCCESS",
}

const getAndSetNotificationTask = {
    GET_SET_NOTIFICATION_TASK: 'GET_SET_NOTIFICATION_TASK'
}
export const taskConstants = {
    getAllTasks,
    editTaskConstants,
    addTaskConstants,
    deleteTaskConstants,
    completeTaskConstants,
    getRecentTaskConstants,
    dismissTaskConstants,
    redoTaskConstants,
    assignTaskConstants,
    checkTaskToRemindConstants,
    nudgeTaskConstants,
    getAndSetNotificationTask
};