import React, { Component } from 'react'
import './ActionsTask.css';

import { Modal, Avatar, TimePicker, DatePicker, Button } from 'antd';
import { CheckOutlined, AlertOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions'
import moment from 'moment';

let DataCheckedMembers = [];
class RemindTaskForm extends Component {

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
        const { idTask, deleteCC } = this.props;
        alert('alo')
        deleteCC(idTask);
    }
    render() {
        const { checkedMembers } = this.state;
        const { idTask } = this.props;

        DataCheckedMembers = checkedMembers;
        console.log('test', idTask)
        const { assignedMembers } = this.props;


        return (

            <div>
                <div className="action-task-title">
                    <AlertOutlined style={{ color: 'orange', fontSize: 20, marginRight: 10 }} />
                    <span>Do you want to remind assigned members?</span>
                </div>


                <div className="form-done-task">

                    <div className="action-task-label">
                        Remind member
                    </div>
                    <div style={{ marginTop: 10 }} className="action-task-detail-data">
                        {assignedMembers.map(item =>
                            <div className="container-avatar-member">
                                <div className="avatar-member"
                                    onClick={() => this.handledChangeAvatar(item.mID._id)}>
                                    <Avatar className="icon-avatar-member" src={item.mID.mAvatar} />
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
                            onClick={() => { Modal.destroyAll() }}>Cancel</Button>
                        <Button type="primary"
                            onClick={this.handleClickOk}>Remind</Button>
                    </div>
                </div>
            </div>
        )
    }
}




export default RemindTaskForm;


