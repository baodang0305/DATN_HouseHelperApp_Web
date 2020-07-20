import React, { Component } from 'react'
import './ActionsTask.css';

import { Modal, Avatar, TimePicker, DatePicker, Button } from 'antd';
import { CheckOutlined, AlertOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions'
import moment from 'moment';


let DataCheckedMembers = [];
class NudgeTaskForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedMembers: []
        }
    }

    handledChangeAvatar = (indexItem) => {
        const { checkedMembers } = this.state;
        const i = checkedMembers.indexOf(indexItem);
        if (i !== -1) {
            checkedMembers.splice(i, 1);
            this.setState({ checkedMembers: checkedMembers });

        } else {
            this.setState({ checkedMembers: [...checkedMembers, indexItem] });
        }

    }

    handleClickOk = () => {
        const { idTask, nudgeTask } = this.props;
        const { checkedMembers } = this.state;
        nudgeTask(idTask, checkedMembers)
    }
    render() {
        const { checkedMembers } = this.state;
        const { idTask } = this.props;

        DataCheckedMembers = checkedMembers;

        const { assignedMembers } = this.props;

        return (

            <div>
                <div className="action-task-title">
                    <AlertOutlined style={{ color: 'orange', fontSize: 20, marginRight: 10 }} />
                    <span>Bạn có muốn nhắc nhở các thành viên cho công việc?</span>
                </div>


                <div className="form-done-task">

                    <div className="action-task-label">
                        Thành viên muốn nhắc nhở:
                    </div>
                    <div style={{ marginTop: 10 }} className="action-task-detail-data">
                        {assignedMembers.map(item =>
                            <div key={item.mID._id} className="modal-task__member-container">
                                <div className="avatar-member"
                                    onClick={() => this.handledChangeAvatar(item.mID._id)}>
                                    <Avatar
                                        className={checkedMembers.indexOf(item.mID._id) !== -1 ? "icon-avatar-member-checked" : "icon-avatar-member"} src={item.mID.mAvatar.image} />
                                    <CheckOutlined
                                        className="icon-check-assign-member"
                                        hidden={checkedMembers.indexOf(item.mID._id) !== -1 ? false : true} />
                                </div>
                                <div className='name-avatar-member'>{item.mID.mName}</div>
                            </div>)}


                    </div>
                </div>
                <div style={{ width: '100%' }}>

                    <div className="action-task-form-btn">
                        <Button type='default'
                            style={{ marginRight: 15 }}
                            onClick={() => { Modal.destroyAll() }}>Hủy</Button>
                        <Button type="primary"
                            onClick={this.handleClickOk}>Nhắc nhở</Button>
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
    nudgeTask: taskActions.nudgeTask
}


export default connect(mapStateToProps, actionCreators)(NudgeTaskForm);


