import React, { Component } from 'react'
import './ActionsTask.css';

import { Modal, Avatar, TimePicker, DatePicker, Button, message } from 'antd';
import { CheckOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions';
import moment from 'moment';

class CompleteTaskForm extends Component {
    state = {
        checkedMembers: []
    }
    handledChangeAvatar = (indexItem) => {
        const { checkedMembers } = this.state;
        const i = checkedMembers.indexOf(indexItem);
        if (i !== -1) {
            checkedMembers.splice(i, 1);
            this.setState({ checkedMembers: checkedMembers });

        } else {
            this.setState({ checkedMembers: [indexItem] });
        }

    }
    componentWillReceiveProps(next) {
        next.messageType === 'error' ? message.error({ content: next.messageAlert, duration: 2 }) :
            message.success({ content: next.messageAlert, duration: 2 })
    }
    handleClickOk = () => {
        const { idTask, completeTask } = this.props;
        const { checkedMembers } = this.state;
        completeTask(idTask, checkedMembers[0]);
    }
    render() {

        const { checkedMembers } = this.state;

        console.log('test', checkedMembers)
        const { assignedMembers, idTask, nameTask } = this.props;
        return (
            <div>
                <div className="action-task-title">
                    <CheckCircleOutlined style={{ color: '#9DCC80', fontSize: 20, marginRight: 10 }} />
                    <span>Do you want to complete this task?</span>
                </div>

                <div className="form-done-task">
                    <div>
                        <div className="action-task-label">
                            Completed by
                        </div>
                        <div style={{ marginTop: 10 }} className="list-avatar-member">
                            {assignedMembers.length !== 0 ? assignedMembers.map(item =>
                                <div className="container-avatar-member">
                                    <div className="avatar-member"
                                        onClick={() => this.handledChangeAvatar(item.mID._id)}>
                                        <Avatar className="icon-avatar-member" src={item.mID.mAvatar} />
                                        <CheckOutlined
                                            className="icon-check-assign-member"
                                            hidden={checkedMembers.indexOf(item.mID._id) !== -1 ? false : true} />
                                    </div>
                                    <div className='name-avatar-member'>{item.mID.mName}</div>
                                </div>) : <div>All member can do</div>}
                        </div>
                    </div>

                    <div>
                        <div className="action-task-label">
                            Completed time
                        </div>
                        <div className="action-task-detail-data">
                            <DatePicker
                                showTime
                                style={{ width: '100%' }}
                                defaultValue={moment()} size="large" />
                        </div>
                    </div>
                </div>
                <div style={{ width: '100%' }}>

                    <div className="action-task-form-btn">
                        <Button type='default'
                            style={{ marginRight: 15 }}
                            onClick={() => { Modal.destroyAll() }}>Cancel</Button>
                        <Button type="primary" onClick={this.handleClickOk}
                        >Complete</Button>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})
const actionCreators = {
    completeTask: taskActions.completeTask
}
export default connect(mapStateToProps, actionCreators)(CompleteTaskForm);


