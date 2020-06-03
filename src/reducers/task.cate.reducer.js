import { taskCateConstants } from '../constants/task.cate.constants';
import { taskCateActions } from '../actions/task.cate.actions';

function taskCate(state = { allTaskCates: [], successActionTaskCate: false }, actions) {
    switch (actions.type) {
        case taskCateConstants.taskCateRequest.TASK_CATE_REQUEST: {
            return { ...state, loading: true }
        }
        case taskCateConstants.getAllTaskCate.GET_ALL_TASK_CATE_SUCCESS: {
            return { ...state, loading: false, allTaskCates: actions.allTaskCates, idCommonTaskCate: actions.idCommonTaskCate }
        }

        case taskCateConstants.addTaskCate.ADD_TASK_CATE_SUCCESS: {
            return { ...state, loading: false }
        }

        case taskCateConstants.editTaskCate.EDIT_TASK_CATE_SUCCESS: {
            return { ...state, loading: false, allTaskCates: actions.dataTaskCates }
        }

        case taskCateConstants.deleteTaskCate.DELETE_TASK_CATE_SUCCESS: {
            return { ...state, loading: false, allTaskCates: actions.dataTaskCates }
        }
        case taskCateConstants.taskCateFailure.TASK_CATE_FAILURE: {
            return { ...state, loading: false }
        }
        default: {
            return { ...state }
        }
    }
}
export default taskCate;