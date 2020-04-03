import authentication from './authentication.reducers';
import family from './family.reducers';
import alert from './alert.reducers';
import task from './task.reducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    authentication,
    task,
    family,
    alert
});
export default rootReducer;