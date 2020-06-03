import React, { Component } from 'react'
import './ActionsTask.css';

import { Modal, Avatar, TimePicker, DatePicker, Button, message } from 'antd';
import { CheckOutlined, CheckCircleOutlined, SolutionOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions';
import moment from 'moment';
import 'moment/locale/vi';

class AssignTaskForm extends Component {
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

    handleClickOk = () => {
        const { idTask, assignTask } = this.props;
        assignTask(idTask);
    }
    render() {

        const { checkedMembers } = this.state;
        const { idTask, user } = this.props;
        return (
            <div>
                <div className="action-task-title">
                    <SolutionOutlined style={{ color: '#2985ff', fontSize: 20, marginRight: 10 }} />
                    <span>Ban muốn nhận công việc đã chọn?</span>
                </div>

                <div className="form-done-task">
                    <div>
                        <div>
                            <div className="action-task-label">Thành viên nhận công việc:</div>
                            <div className="action-task-detail-data">
                                <div className="modal-task__member-container">
                                    <div className="avatar-member">
                                        <Avatar className="icon-avatar-member" src={user.mAvatar.image} />
                                    </div>
                                    <div className='name-avatar-member'>{user.mName}</div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="action-task-label">
                            Completed by
                        </div>
                        <div style={{ marginTop: 10 }} className="list-avatar-member">
                            {assignedMembers.length !== 0 ? assignedMembers.map(item =>
                                <div className="modal-task__member-container">
                                    <div className="avatar-member"
                                        onClick={() => this.handledChangeAvatar(item.mID._id)}>
                                        <Avatar className="icon-avatar-member" src={item.mID.mAvatar.image} />
                                        <CheckOutlined
                                            className="icon-check-assign-member"
                                            hidden={checkedMembers.indexOf(item.mID._id) !== -1 ? false : true} />
                                    </div>
                                    <div className='name-avatar-member'>{item.mID.mName}</div>
                                </div>) : <div>All member can do</div>}
                        </div> */}
                    </div>

                    <div>
                        <div className="action-task-label">
                            Bạn có muốn chọn lại thời hạn?
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
                            onClick={() => { Modal.destroyAll() }}>Hủy</Button>
                        <Button type="primary" onClick={this.handleClickOk}
                        >Nhận việc</Button>
                    </div>
                </div>

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.inforLogin.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})
const actionCreators = {
    assignTask: taskActions.assignTask
}
export default connect(mapStateToProps, actionCreators)(AssignTaskForm);


