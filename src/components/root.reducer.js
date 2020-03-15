import LoginReducer from './login/login.reducer';


import { combineReducers } from 'redux';

const rootReducer = combineReducers({ LoginReducer });
export default rootReducer;