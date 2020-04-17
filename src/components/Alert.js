import React from "react";
import { connect } from "react-redux";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alertActions } from "../actions/alert.actions";

import history from "../helpers/history";

class Alert extends React.Component {

    constructor(props) {
        super(props);
        history.listen((location, action) => { this.props.clearAlerts(); });
        this.notify = this.notify.bind(this);
    }

    notify = () => {

        const { alert } = this.props;
        this.toastId = toast(alert.message, {
            autoClose: 2000,
            type: alert.type,
            closeButton: true,
            newestOnTop: true,
            transition: Bounce,
            position: 'top-center',
            containerId: 'MainPage'
        });

    }

    render() {

        const { alert } = this.props;

        return (
            <div> {alert.message && this.notify()} </div>
        );

    }

}

function mapStateToProps(state) {

    const { alert } = state;
    return { alert };

}

const actionCreators = {

    clearAlerts: alertActions.clear

};

export default connect(mapStateToProps, actionCreators)(Alert);
