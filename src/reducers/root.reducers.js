import { combineReducers } from 'redux';
import taskCate from './task.cate.reducer';
import task from './task.reducers';
import index from './index.reducers';
import alert from './alert.reducers';
import family from './family.reducers';
import calendar from './calendar.reducers';
import authentication from './authentication.reducers';


const rootReducer = combineReducers({
    taskCate,
    task,
    alert,
    index,
    family,
    calendar,
    authentication
});
export default rootReducer;