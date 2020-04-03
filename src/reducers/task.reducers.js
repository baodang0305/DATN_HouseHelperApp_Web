import { taskConstants } from '../constants/task.constants';

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

        case taskConstants.getRecentTaskConstants.GET_RECENT_TASK:
            {
                return {
                    ...state, recentTask: action.recentTask
                }
            }
        default: return state;
    }
}

export default task;