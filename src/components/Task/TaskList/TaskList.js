import React from 'react'
import { List, Avatar, Button, Skeleton, Col, Row, Modal, Tooltip } from 'antd';
import history from '../../../helpers/history';
import token from '../../../helpers/token';
import { connect } from 'react-redux';
import axios from 'axios';

import './TaskList.css'

import {
    EditOutlined,
    CloseOutlined,
    DeleteOutlined,
    CheckOutlined,
    StopOutlined,
    AlertOutlined,
    StarOutlined,
    SnippetsOutlined,
    ArrowUpOutlined, SolutionOutlined
} from '@ant-design/icons';
import moment from 'moment';
import CompleteTaskForm from '../ActionTask/ActionCompleteTask';
import RemindTaskForm from '../ActionTask/ActionRemindTask';
import DismissTaskForm from '../ActionTask/ActionDismissTask';
import DeleteTaskForm from '../ActionTask/ActionDeleteTask';
import RedoTaskForm from '../ActionTask/ActionRedoTask';
import AssignTaskForm from '../ActionTask/ActionAssignTask';
import { taskActions } from '../../../actions/task.actions';

const checkAccession = (item, user) => {
    if (item.assign === null) {
        return false
    }
    else if (item.assign !== null) {
        if (item.assign.mAssigns.findIndex(i => i.mID._id === user._id) !== -1 || user.mIsAdmin)
            return true
    }
}
class TaskList extends React.Component {
    state = {
        initLoading: true,

        hiddenActionsList: true,
        index: '',
        visibleCompleteTask: false,
        visibleDismissTask: false,
        visibleRemindTask: false,
        visibleDeleteTask: false,
        visibleRedoTask: false,
        visibleAssignTask: false,
        nameTask: '',
        dataTemp: { idTask: '', nameTask: '', memberUser: null },

    };


    componentWillReceiveProps(nextProps) {
        nextProps.messageType === 'success' ? this.setState({
            visibleCompleteTask: false,
            visibleDismissTask: false,
            visibleRemindTask: false,
            visibleDeleteTask: false,
            visibleRedoTask: false,
            visibleAssignTask: false,
            hiddenActionsList: true,
        }) : null
    }


    render() {

        const { hiddenActionsList,
            index,
            visibleRedoTask, visibleAssignTask,
            visibleCompleteTask,
            visibleDismissTask,
            visibleRemindTask,
            visibleDeleteTask, dataTemp
        } = this.state;

        const { dataTasks, actionTask, user } = this.props;


        return (
            <div>

                <List
                    itemLayout="horizontal"
                    pagination={{
                        pageSize: 5
                    }}
                    dataSource={dataTasks}
                    renderItem={item => (
                        <List.Item style={{ padding: '5px 0', minHeight: 87 }}
                            onClick={(e) => {
                                this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id, dataTemp: { idTask: item._id, nameTask: item.name, memberUser: item.assign } })
                                this.props.getRecentTask(item);
                            }}
                            actions={
                                (item._id === index && hiddenActionsList === false)
                                    ? (item.state === 'todo' || 'upcoming' ? [
                                        <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                            {item.assign === null ? <div className="list-action"
                                                onClick={(e) => {
                                                    this.setState({ visibleAssignTask: true, })
                                                }}>
                                                <SolutionOutlined className="icon-action-task" />
                                                <div>Nhận việc</div>
                                            </div> : null}


                                            <div className="list-action"
                                                onClick={() => (this.setState({ visibleCompleteTask: true }))}>

                                                <CheckOutlined style={{ color: '#09ed37' }} className="icon-action-task" />
                                                <div>Hoàn thành</div>
                                            </div>
                                            {checkAccession(item, user) === true ? <div className="list-action"
                                                onClick={() => (this.setState({ visibleDismissTask: true }))}>
                                                <StopOutlined style={{ color: '#F8DA74' }} className="icon-action-task" />
                                                <div>Bỏ qua</div>
                                            </div> : false}




                                            <div className="list-action"
                                                onClick={() => (this.setState({ visibleRemindTask: true }))}
                                            >
                                                <AlertOutlined style={{ color: 'orange' }} className="icon-action-task" />
                                                <div>Nhắc nhở</div>
                                            </div>
                                            {user.mIsAdmin === true ? <div className="list-action"
                                                onClick={() => history.push("/tasks/edit-task")}>
                                                <EditOutlined style={{ color: '#756f6d' }} className="icon-action-task" />
                                                <div>Sửa</div>
                                            </div> : null
                                            }
                                            {user.mIsAdmin === true ? <div className="list-action"
                                                onClick={(e) => {
                                                    this.setState({ visibleDeleteTask: true, })
                                                }}>
                                                <DeleteOutlined style={{ color: '#EC6764' }} className="icon-action-task" />
                                                <div>Xóa bỏ</div>
                                            </div> : null}


                                        </div>
                                    ] : [
                                            <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                                <div className="list-action"
                                                    onClick={(e) => {
                                                        this.setState({ visibleRedoTask: true, })
                                                    }}>
                                                    <div><ArrowUpOutlined style={{ color: '#2295FF', fontSize: 20 }} /></div>
                                                    <div>Làm lại</div>
                                                </div>
                                            </div>
                                        ]) : null}>
                            <Skeleton avatar title={false} loading={item.loading} active style={{ width: '100%' }}>

                                <div className="detail-task" style={{ width: '100%' }}>
                                    <Row gutter={10} style={{ width: '100%' }}>
                                        <Col span={12} hidden={item._id === index ? (hiddenActionsList === true ? false : true) : false}>
                                            <div className="infor-task">
                                                <div className="name-task">{item.name}<span style={{ fontSize: 13, fontWeight: 500, color: '#13AA52' }}>&ensp;-&ensp;{item.tcID.name}</span></div>
                                                {item.notes === "" ? null :
                                                    <div className="note-task">
                                                        <SnippetsOutlined style={{ fontSize: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 4 }} />
                                                    &nbsp;{item.notes}
                                                    </div>}

                                                <div className="time-task">{item.dueDate === null ? `${'Không gia hạn thời gian'}` : moment(`${item.dueDate}`).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                            </div>
                                        </Col>
                                        <Col span={4} className="show-image-task" hidden={item._id === index ? (hiddenActionsList === true ? false : true) : false}>
                                            <img className="image-task" src={item.photo} alt="" hidden={item.photo === null ? true : false} />
                                        </Col>
                                        <Col flex="auto" className="show-assign-action-task">
                                            <div className="icon-assigned-point">

                                                {/* Assigned members */}
                                                <div className="icon-assigned">

                                                    {item.assign !== null ? item.assign.mAssigns.map(item =>
                                                        <div className="container-icon-avatar">
                                                            <Tooltip placement="top" title={item.mID.mName} overlayStyle={{}}>
                                                                <Avatar className="icon-avatar" src={item.mID.mAvatar.image} />

                                                            </Tooltip>
                                                        </div>)
                                                        :
                                                        hiddenActionsList === false ? null : <div className="list-action"
                                                            onClick={(e) => {

                                                                this.setState({ visibleAssignTask: true, })
                                                            }}>
                                                            <SolutionOutlined className="icon-action-task" />
                                                            <div>Nhận việc</div>
                                                        </div>}
                                                </div>

                                                <div className="task-point">
                                                    <StarOutlined className="icon-task-point" />
                                                    <span className="point">&nbsp;{item.points} điểm</span>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                </div>
                            </Skeleton>
                        </List.Item>
                    )}
                />
                <Modal style={{ maxWidth: 416 }}
                    visible={visibleCompleteTask}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleCompleteTask: false })}>
                    <CompleteTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} assignedMembers={dataTemp.memberUser !== null ? dataTemp.memberUser.mAssigns : []} />
                </Modal>
                <Modal style={{ maxWidth: 416 }}
                    footer={null}
                    visible={visibleDismissTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleDismissTask: false })}>
                    <DismissTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} memberDismiss={user} />
                </Modal>
                <Modal
                    footer={null}
                    visible={visibleRemindTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleRemindTask: false })}>
                    <RemindTaskForm idTask={dataTemp.idTask} assignedMembers={dataTemp.memberUser !== null ? dataTemp.memberUser.mAssigns : []} />
                </Modal>
                <Modal style={{ maxWidth: 416 }}
                    footer={null}
                    visible={visibleDeleteTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleDeleteTask: false })}>
                    <DeleteTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} memberDelete={user} />
                </Modal>
                <Modal style={{ maxWidth: 416 }}
                    footer={null}
                    visible={visibleRedoTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleRedoTask: false })}>
                    <RedoTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} />
                </Modal>
                <Modal style={{ maxWidth: 416 }}
                    footer={null}
                    visible={visibleAssignTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleAssignTask: false })}>
                    <AssignTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.inforLogin.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})

const actionCreators = {
    getRecentTask: taskActions.getRecentTask,


}

export default connect(mapStateToProps, actionCreators)(TaskList);