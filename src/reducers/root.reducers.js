import authentication from './authentication.reducers';
import alert from './alert.reducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ 
    authentication,
    alert
});
export default rootReducer;