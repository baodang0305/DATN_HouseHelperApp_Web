import { taskConstants } from '../constants/task.constants';
import { taskActions } from '../actions/task.actions';

const initialState = { actionTask: false }
function task(state = initialState, action) {
    switch (action.type) {
        case taskConstants.deleteTaskConstants.DELETE_REQUEST:
            {
                return {
                    ...state,
                    loading: true
                }
            }
        case taskConstants.deleteTaskConstants.DELETE_SUCCESS:
            {
                return {
                    ...state,
                    actionTask: true,
                }
            }
        case taskConstants.deleteTaskConstants.DELETE_FAILURE:
            {
                return {
                }
            }
        case taskConstants.completeTaskConstants.COMPLETE_REQUEST:
            {
                return {
                    ...state,
                    loading: true,

                }
            }
        case taskConstants.completeTaskConstants.COMPLETE_SUCCESS:
            {
                return {
                    ...state,
                    actionTask: true,
                }
            }
        case taskConstants.completeTaskConstants.COMPLETE_FAILURE:
            {
                return {
                    ...state,
                    actionTask: false
                }
            }

        case taskConstants.addTaskConstants.ADD_TASK_REQUEST:
            {
                return {
                    ...state,
                    loading: true
                }
            }
        case taskConstants.addTaskConstants.ADD_TASK_SUCCESS:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: true,
                }
            }
        case taskConstants.addTaskConstants.ADD_TASK_FAILURE:
            {
                return {
                }
            }

        case taskConstants.editTaskConstants.EDIT_TASK_REQUEST:
            {
                return {
                    ...state,
                    loading: true
                }
            }
        case taskConstants.editTaskConstants.EDIT_TASK_SUCCESS:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: true,
                }
            }
        case taskConstants.editTaskConstants.EDIT_TASK_FAILURE:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: false,
                }
            }

        case taskConstants.dismissTaskConstants.DISMISS_REQUEST:
            {
                return {
                    ...state,
                    loading: true,
                }
            }
        case taskConstants.dismissTaskConstants.DISMISS_SUCCESS:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: true
                }
            }
        case taskConstants.getRecentTaskConstants.GET_RECENT_TASK:
            {
                return {
                    ...state, recentTask: action.recentTask
                }
            }
        case taskConstants.checkTaskToRemindConstants.CHECK_TASK_TO_REMIND:
            {
                return {
                    ...state,
                    taskNeedRemind: action.taskNeedRemind
                }
            }

        // Action assign member for task that no assigned member
        case taskConstants.assignTaskConstants.ASSIGN_REQUEST:
            {
                return {
                    ...state,
                    loading: true,
                }
            }

        case taskConstants.assignTaskConstants.ASSIGN_SUCCESS:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: true,
                }
            }
        case taskConstants.assignTaskConstants.ASSIGN_FAILURE:
            {
                return {
                    ...state,
                    loading: false,
                    actionTask: false
                }
            }
        default: return state;
    }
}

export default task;