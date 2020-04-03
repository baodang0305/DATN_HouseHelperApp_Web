import React, { Component } from 'react';
import { Modal, Button, Avatar } from 'antd';
import './ActionsTask.css';

import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions'
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';


class DeleteTaskForm extends Component {
    constructor(props) {
        super(props);
    }

    handleClickOk = () => {
        const { idTask, deleteTask } = this.props;
        deleteTask(idTask);

    }
    render() {
        const { idTask, user, nameTask } = this.props
        return (
            <div>
                <div className="action-task-title">
                    <DeleteOutlined style={{ color: '#EC6764', fontSize: 20, marginRight: 10 }} />
                    <span>Do you want to delete this task?</span>
                </div>
                <div >
                    <div>
                        <div className="action-task-label">Deleted by</div>
                        <div className="action-task-detail-data">
                            <div className="avatar-member">
                                <Avatar className="icon-avatar-member" src={user.member.mAvatar} />
                            </div>
                            <div className='name-avatar-member'>{user.member.mName}</div>
                        </div>
                    </div>

                    <div>
                        <div className="action-task-label">Deleted at</div>
                        <div className="action-task-detail-data" style={{ color: '#38589E', fontSize: 14, fontWeight: 500 }}>{moment().format('MMMM Do YYYY, h:mm:ss a')}</div>
                    </div>
                    <div style={{ width: '100%' }}>

                        <div className="action-task-form-btn">
                            <Button type='default'
                                style={{ marginRight: 15 }}
                                onClick={() => { Modal.destroyAll() }}>Cancel</Button>
                            <Button type="danger" onClick={this.handleClickOk}>Delete</Button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.user
})
const actionCreators = {
    deleteTask: taskActions.deleteTask

}

export default connect(mapStateToProps, actionCreators)(DeleteTaskForm);