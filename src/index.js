import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Root from "./components/Root";
import rootReducer from './reducers/Root.Reducer';


const store = createStore(rootReducer, composeWithDevTools(
    applyMiddleware()));


ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById("root")
);