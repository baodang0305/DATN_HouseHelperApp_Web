import { taskCateConstants } from '../constants/task.cate.constants';
import { taskCateActions } from '../actions/task.cate.actions';

function taskCate(state = { allTaskCates: [] }, actions) {
    switch (actions.type) {
        case taskCateConstants.taskCateRequest.TASK_CATE_REQUEST: {
            return { ...state, loading: true }
        }
        case taskCateConstants.getAllTaskCate.GET_ALL_TASK_CATE_SUCCESS: {
            return { ...state, loading: false, allTaskCates: actions.allTaskCates, idCommonTaskCate: actions.idCommonTaskCate }
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