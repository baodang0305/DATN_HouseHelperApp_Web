import { combineReducers } from 'redux';
import task from './task.reducers';
import index from './index.reducers';
import alert from './alert.reducers';
import family from './family.reducers';
import authentication from './authentication.reducers';


const rootReducer = combineReducers({
    task,
    alert,
    index,
    family,
    authentication
});
export default rootReducer;