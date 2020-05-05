import React, { Component } from 'react';
import { Modal, Button, Avatar, message } from 'antd';
import './ActionsTask.css';

import { connect } from 'react-redux';
import { taskActions } from '../../../actions/task.actions'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';


class DismissTaskForm extends Component {
    constructor(props) {
        super(props);
    }

    handleClickOk = () => {
        const { idTask, dismissTask } = this.props;
        dismissTask(idTask);
    }
    render() {
        const { idTask, memberDismiss } = this.props
        return (
            <div>
                <div className="action-task-title">
                    <ExclamationCircleOutlined style={{ color: '#F8DA74', fontSize: 20, marginRight: 10 }} />
                    <span>Bạn có muốn bỏ qua công việc đã chọn?</span>
                </div>

                <div >
                    <div>
                        <div className="action-task-label">Thành viên bỏ qua:</div>
                        <div className="action-task-detail-data">
                            <div className="avatar-member">
                                <Avatar className="icon-avatar-member" src={memberDismiss.mAvatar.image} />
                            </div>
                            <div className='name-avatar-member'>{memberDismiss.mName}</div>
                        </div>
                    </div>

                    <div>
                        <div className="action-task-label">Thời điểm bỏ qua:</div>
                        <div className="action-task-detail-data" style={{ color: '#38589E', fontSize: 14, fontWeight: 500 }}>{moment().calendar()}</div>
                    </div>
                    <div style={{ width: '100%' }}>

                        <div className="action-task-form-btn">
                            <Button type='default'
                                style={{ marginRight: 15 }}
                                onClick={() => { Modal.destroyAll() }}>Hủy</Button>
                            <Button type="primary"
                                onClick={this.handleClickOk}>Bỏ qua</Button>
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
    dismissTask: taskActions.dismissTask
}

export default connect(mapStateToProps, actionCreators)(DismissTaskForm);