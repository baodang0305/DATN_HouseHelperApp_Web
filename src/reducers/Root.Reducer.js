import LoginReducer from './Login.Reducer';
import family from './family';

import { combineReducers } from 'redux';

const rootReducer = combineReducers({ 
    family,
    LoginReducer
});
export default rootReducer;