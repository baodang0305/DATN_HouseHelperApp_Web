import React, { Component } from 'react';
import { Modal, Button, Avatar, message } from 'antd';
import './ActionsTask.css';

import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';


class DismissTaskForm extends Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(next) {
        next.messageType === 'error' ? message.error({ content: next.messageAlert, duration: 2 }) :
            message.success({ content: next.messageAlert, duration: 2 })
    }
    handleClickOk = () => {
        const { idTask, deleteTask } = this.props;
        deleteTask(idTask);
    }
    render() {
        const { idTask, memberDismiss, nameTask } = this.props
        return (
            <div>
                <div className="action-task-title">
                    <ExclamationCircleOutlined style={{ color: '#F8DA74', fontSize: 20, marginRight: 10 }} />
                    <span>Do you want to dismiss this task?</span>
                </div>

                <div >
                    <div>
                        <div className="action-task-label">Dismissed by</div>
                        <div className="action-task-detail-data">
                            <div className="avatar-member">
                                <Avatar className="icon-avatar-member" src={memberDismiss.member.mAvatar} />
                            </div>
                            <div className='name-avatar-member'>{memberDismiss.member.mName}</div>
                        </div>
                    </div>

                    <div>
                        <div className="action-task-label">Dismissed at</div>
                        <div className="action-task-detail-data" style={{ color: '#38589E', fontSize: 14, fontWeight: 500 }}>{moment().format('MMMM Do YYYY, h:mm:ss a')}</div>
                    </div>
                    <div style={{ width: '100%' }}>

                        <div className="action-task-form-btn">
                            <Button type='default'
                                style={{ marginRight: 15 }}
                                onClick={() => { Modal.destroyAll() }}>Cancel</Button>
                            <Button type="primary"
                                onClick={this.handleClickOk}>Dismiss</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    messageType: state.alert.type,
    messageAlert: state.alert.message
})
const actionCreators = {
    deleteTask: taskActions.deleteTask
}

export default connect(mapStateToProps, actionCreators)(DismissTaskForm);