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
        const { idTask, memberDelete, nameTask } = this.props
        return (
            <div>
                <div className="action-task-title">
                    <DeleteOutlined style={{ color: '#EC6764', fontSize: 20, marginRight: 10 }} />
                    <span>Bạn có muốn xóa công việc đã chọn?</span>
                </div>
                <div >
                    <div>
                        <div className="action-task-label">Thành viên xóa:</div>
                        <div className="action-task-detail-data">
                            <div className="modal-task__member-container">
                                <div className="avatar-member">
                                    <Avatar className="icon-avatar-member" src={memberDelete.mAvatar.image} />
                                </div>
                                <div className='name-avatar-member'>{memberDelete.mName}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="action-task-label">Thời điểm xóa:</div>
                        <div className="action-task-detail-data" style={{ color: '#38589E', fontSize: 14, fontWeight: 500 }}>
                            {moment().format('DD-MM-YYYY, HH:mm a')}</div>
                    </div>
                    <div style={{ width: '100%' }}>

                        <div className="action-task-form-btn">
                            <Button type='default'
                                style={{ marginRight: 15 }}
                                onClick={() => { Modal.destroyAll() }}>Hủy</Button>
                            <Button type="danger" onClick={this.handleClickOk}>Xóa</Button>
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