import authentication from './authentication.reducers';
import family from './family.reducers';
import alert from './alert.reducers';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({ 
    authentication,
    family,
    alert
});
export default rootReducer;