import React from "react";
import { connect } from "react-redux";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { alertActions } from "../actions/alert.actions";

import history from "../helpers/history";
import moment from 'moment';

import { calendarActions } from "../actions/calendar.actions";

class Alert extends React.Component {

    constructor(props) {
        super(props);
        history.listen((location, action) => { this.props.clearAlerts(); });
        this.notify = this.notify.bind(this);
    }

    onClose = () => {
        const { stopRemindEventNotification } = this.props;
        stopRemindEventNotification();
    }

    notify = () => {

        const { alert } = this.props

        const taskNotification = alert.type === "remindTaskNotification" || alert.type === 'nudgeTaskNotification' ? alert.data : null;
        this.toastId = toast(
            alert.type === "remindTaskNotification" || alert.type === "nudgeTaskNotification"
                ? <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
                    <div>{alert.message}</div>
                    {alert.type === 'nudgeTaskNotification' ? null : <div>{taskNotification.name}</div>}
                    {taskNotification.notes ? <div>{taskNotification.notes}</div> : null}
                    <div>{moment(taskNotification.dueDate).format('DD-MM-YYYY, HH:mm a')}</div>
                </div>
                : alert.message, {
            autoClose: alert.type === "remindTaskNotification" || alert.type === "nudgeTaskNotification" || alert.type === "remindEventNotification" ? false : 2000,
            type: alert.type === "remindTaskNotification" || alert.type === "nudgeTaskNotification" || alert.type === "remindEventNotification" ? "error" : alert.type,
            closeButton: true,
            newestOnTop: true,
            transition: Bounce,
            position: alert.type === "remindTaskNotification" || alert.type === "nudgeTaskNotification" || alert.type === "remindEventNotification" ? 'bottom-right' : 'top-center',
            containerId: 'MainPage',
            onClose: alert.type === "remindEventNotification" ? this.onClose : false
        });

    }

    render() {

        const { alert } = this.props

        return (
            <div> {alert.message && this.notify()} </div>
        );

    }

}

const mapStateToProps = (state) => ({
    alert: state.alert
});

const actionCreators = {
    clearAlerts: alertActions.clear,
    stopRemindEventNotification: calendarActions.stopRemindEventNotification
};

export default connect(mapStateToProps, actionCreators)(Alert);
