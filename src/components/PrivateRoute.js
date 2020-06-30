import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
// import io from 'socket.io-client';

const IsLogin = ({ component: Component, ...rest }) => {
    if (localStorage.getItem('inforLogin')) {
        console.log('Đã đăng nhập');
        // if (!global.socket) {
        //     global.socket = io('http://localhost:3000')
        // }
        return (
            <Route {...rest} render={props => (
                <Component {...props} />
            )} />
        )
    }
    else {
        console.log('Chưa đăng nhập');
        return (
            <Route {...rest} render={props => (
                <Redirect to={{ pathname: '/', state: { from: props.location } }} />
            )} />
        )
    }
}

const IsNotLogin = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => (
        !localStorage.getItem('inforLogin')
            ? <Component {...props} />
            : <Redirect to={{ pathname: '/family', state: { from: props.location } }} />
    )} />
)

const PrivateRoute = {
    IsLogin,
    IsNotLogin,
}

export default PrivateRoute;