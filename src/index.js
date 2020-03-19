import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import 'antd/dist/antd.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Root from "./components/Root";
import rootReducer from './reducers/Root.Reducer';


const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunkMiddleware)));


ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById("root")
);