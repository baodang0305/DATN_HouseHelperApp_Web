import authentication from './authentication.reducers';
import alert from './alert.reducers';
import task from './task.reducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    authentication,
    alert,
    task
});
export default rootReducer;