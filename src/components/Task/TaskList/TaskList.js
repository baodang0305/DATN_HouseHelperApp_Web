import React from 'react'
import { List, Avatar, Button, Skeleton, Col, Row, Modal, Tooltip, Checkbox, Spin } from 'antd';
import history from '../../../helpers/history';
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
    StarOutlined, StarTwoTone, StarFilled,
    SnippetsOutlined,
    ArrowUpOutlined, SolutionOutlined, LoadingOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';

import CompleteTaskForm from '../ActionTask/ActionCompleteTask';
import NudgeTaskForm from '../ActionTask/ActionNudgeTask';
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

    shouldComponentRender() {
        const { loadingMember, loadingGetAllTask, loadingTaskCate, } = this.props;
        if (loadingMember || loadingGetAllTask || loadingTaskCate)
            return false
        return true
    }

    checkCompleteByCheckBox(itemTask) {

        const { completeTask, user, redoTask } = this.props;
        const { hiddenActionsList } = this.state;
        this.setState({ index: itemTask._id, dataTemp: { idTask: itemTask._id, nameTask: itemTask.name, memberUser: itemTask.assign } })

        if (itemTask.assign !== null && itemTask.state === 'todo') {
            let isAssigned = itemTask.assign.mAssigns.map(i => i.mID._id).indexOf(user._id);
            if (itemTask.assign.isAll === false && isAssigned !== -1) {
                completeTask(itemTask._id, user._id);
            }
            else if (isAssigned === -1 || (isAssigned === -1 && user.mIsAdmin === true) || itemTask.assign.isAll === true) {
                this.props.getRecentTask(itemTask);
                this.setState({ visibleCompleteTask: true });
            }

        }
        else if (itemTask.state === 'completed') {
            redoTask(itemTask._id);
        }

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

        const { dataTasks, actionTask, user, loadingTask } = this.props;


        return (
            <div>
                {this.shouldComponentRender()
                    ? <List className="task__list-task-container"
                        itemLayout="horizontal"

                        pagination={{
                            size: 'small',
                            pageSize: 6
                        }}
                        dataSource={dataTasks}
                        renderItem={item => (
                            <List.Item className="task__list-item" style={{ cursor: 'pointer' }} onClick={() => {
                                if (hiddenActionsList === false) {
                                    this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id, dataTemp: { idTask: item._id, nameTask: item.name, memberUser: item.assign } })
                                    this.props.getRecentTask(item);
                                }

                            }}
                                style={{ padding: '5px 0', minHeight: 87 }} key={`${item._id}`}
                                actions={
                                    (item._id === index && hiddenActionsList === false)
                                        ? (item.state === 'todo' || item.state === 'upcoming' ? [
                                            <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                                <div className="task_action-left-part">
                                                    <div className="task__action-item"
                                                        onClick={() => {
                                                            if (hiddenActionsList === false) {
                                                                this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id, dataTemp: { idTask: item._id, nameTask: item.name, memberUser: item.assign } })
                                                                this.props.getRecentTask(item);
                                                            }
                                                        }}>

                                                        <CloseOutlined style={{ color: '#888888' }} className="icon-action-task" />
                                                        <div className="task__action-title">Đóng</div>
                                                    </div>
                                                </div>
                                                <div className="task__action-right-part">
                                                    {item.assign === null
                                                        ? <div className="task__action-item"
                                                            onClick={(e) => {
                                                                this.setState({ visibleAssignTask: true, })
                                                            }}>
                                                            <SolutionOutlined className="icon-action-task" />
                                                            <div className="task__action-title" style={{ color: "#2985ff" }}>Nhận việc</div>
                                                        </div> : null}

                                                    <div className="task__action-item"
                                                        onClick={() => (this.setState({ visibleCompleteTask: true }))}>

                                                        <CheckOutlined style={{ color: '#09ed37' }} className="icon-action-task" />
                                                        <div style={{ color: '#09ed37' }} className="task__action-title">Hoàn thành</div>
                                                    </div>
                                                    {checkAccession(item, user) === true ? <div className="task__action-item"
                                                        onClick={() => (this.setState({ visibleDismissTask: true }))}>
                                                        <StopOutlined style={{ color: '#F8DA74' }} className="icon-action-task" />
                                                        <div style={{ color: '#F8DA74' }} className="task__action-title">Bỏ qua</div>
                                                    </div> : false}

                                                    {item.assign ? <div className="task__action-item"
                                                        onClick={() => (this.setState({ visibleRemindTask: true }))}>
                                                        <AlertOutlined style={{ color: 'orange' }} className="icon-action-task" />
                                                        <div style={{ color: 'orange' }} className="task__action-title">Nhắc nhở</div>
                                                    </div> : null}

                                                    {user.mIsAdmin === true ? <div className="task__action-item"
                                                        onClick={() => history.push("/tasks/edit-task", { taskNeedEdit: item })}>
                                                        <EditOutlined style={{ color: '#08979c' }} className="icon-action-task" />
                                                        <div style={{ color: '#08979c' }} className="task__action-title">Sửa</div>
                                                    </div> : null
                                                    }
                                                    {user.mIsAdmin === true ? <div className="task__action-item"
                                                        onClick={(e) => {
                                                            this.setState({ visibleDeleteTask: true, })
                                                        }}>
                                                        <DeleteOutlined style={{ color: '#EC6764' }} className="icon-action-task" />
                                                        <div style={{ color: '#EC6764' }} className="task__action-title">Xóa bỏ</div>
                                                    </div> : null}
                                                </div>
                                            </div>
                                        ] : [
                                                <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                                    <div className="task__action-item"
                                                        onClick={(e) => {
                                                            this.setState({ visibleRedoTask: true, })
                                                        }}>
                                                        <div><ArrowUpOutlined style={{ color: '#2295FF', fontSize: 20 }} /></div>
                                                        <div className="task__action-title">Làm lại</div>
                                                    </div>
                                                </div>
                                            ]) : null}>

                                <Skeleton avatar title={false} loading={!this.shouldComponentRender()} active style={{ width: '100%' }}>

                                    <div className="detail-task" style={{ cursor: 'pointer', width: '100%', display: item._id === index ? (hiddenActionsList === true ? null : 'none') : null }} >
                                        <div style={{ marginLeft: '5px', position: 'relative' }}>
                                            {loadingTask && item._id === index
                                                ? <LoadingOutlined style={{ fontSize: 28, color: '#2985ff' }} />
                                                : <div className="round">
                                                    <input checked={item.state === 'completed' ? true : false}
                                                        onChange={(e) => this.checkCompleteByCheckBox(item)}
                                                        type="checkbox" key={item._id} id={`${item._id}`} className="check-box-task" />
                                                    <label htmlFor={`${item._id}`}></label>
                                                </div>}

                                        </div>
                                        <Row gutter={10} style={{ width: '100%', marginLeft: 20, display: item._id === index ? (hiddenActionsList === true ? null : 'none') : null }} onClick={(e) => {
                                            this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id, dataTemp: { idTask: item._id, nameTask: item.name, memberUser: item.assign } })
                                            this.props.getRecentTask(item);
                                        }}>

                                            <Col xs={18} sm={16} md={16} lg={14} xl={12} >
                                                <div className="infor-task">
                                                    <div className="name-task">{item.name}</div>
                                                    {item.notes === "" ? null :
                                                        <div className="note-task">
                                                            <SnippetsOutlined style={{ fontSize: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: 4 }} />
                                                    &nbsp;{item.notes}
                                                        </div>}

                                                    <div className="time-task">
                                                        {item.dueDate === null ? `${'Không gia hạn thời gian'}` : moment(`${item.dueDate}`).format('llll')}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col xs={0} sm={0} md={0} lg={4} xl={4} className="show-image-task" hidden={item._id === index ? (hiddenActionsList === true ? false : true) : false}>
                                                <img className="image-task" src={item.photo} alt="" hidden={item.photo === null ? true : false} />
                                            </Col>
                                            <Col xs={6} sm={8} md={8} lg={6} xl={8} className="show-assign-action-task" style={{ display: item._id === index ? (hiddenActionsList === true ? null : 'none') : null }}>
                                                {/* Assigned members */}
                                                <div className="right-part-item-task">
                                                    <div className="icon-assigned">
                                                        {item.assign !== null ? item.assign.mAssigns.map((member, recentIndex) =>
                                                            <div key={member.mID.mName} className="container-icon-avatar">

                                                                {item.assign.isAll === true ? <div hidden={recentIndex === 0 ? true : false} className="line-connect-all-member"></div> : null}
                                                                <Tooltip placement="top" title={member.mID.mName}>
                                                                    <Avatar style={{
                                                                        border: item.assign.isAll === true && member.isDone === false
                                                                            ? '1px solid #2985ff'
                                                                            : (item.assign.isAll === true && member.isDone === true ? '1px solid rgb(21, 255, 0)' : null)
                                                                        , margin: item.assign.isAll === true ? null : '0 5px'
                                                                    }}
                                                                        className={member.isDone === true ? "icon-avatar-member-completed" : "icon-avatar"} src={member.mID.mAvatar.image} />
                                                                    {member.isDone === true ? <CheckOutlined
                                                                        className="icon-check-member-completed"
                                                                    /> : null}
                                                                </Tooltip>
                                                                {item.assign.isAll === true ? <div hidden={recentIndex === (item.assign.mAssigns.length - 1) ? true : false} className="line-connect-all-member"></div> : null}
                                                            </div>)
                                                            : (item.state === 'completed' ? null : < div className="task__action-item" hidden={item._id === index ? !hiddenActionsList : false}
                                                                onClick={(e) => {
                                                                    this.setState({ visibleAssignTask: true, hiddenActionsList: !this.state.hiddenActionsList })
                                                                }}>
                                                                <SolutionOutlined className="icon-action-task" />
                                                                <div className="task__action-title" style={{ color: "#2985ff" }}>Nhận việc</div>
                                                            </div>)
                                                        }
                                                    </div>

                                                    <div className="task-point">
                                                        <StarOutlined />
                                                        <div className="point">&nbsp;{item.points} điểm</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                    </div>
                                </Skeleton>
                            </List.Item>
                        )
                        }
                    />
                    : <div className="spin-get-list-members  loading-data-grocery"><Spin tip="Đang tải..." /> </div>}

                <Modal className="task__modal"
                    visible={visibleCompleteTask}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleCompleteTask: false })}>
                    <CompleteTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} assignedMembers={dataTemp.memberUser !== null ? dataTemp.memberUser.mAssigns : []} />
                </Modal>
                <Modal
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
                    <NudgeTaskForm idTask={dataTemp.idTask} assignedMembers={dataTemp.memberUser !== null ? dataTemp.memberUser.mAssigns : []} />
                </Modal>
                <Modal
                    footer={null}
                    visible={visibleDeleteTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleDeleteTask: false })}>
                    <DeleteTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} memberDelete={user} />
                </Modal>
                <Modal
                    footer={null}
                    visible={visibleRedoTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleRedoTask: false })}>
                    <RedoTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} />
                </Modal>
                <Modal
                    footer={null}
                    visible={visibleAssignTask}
                    maskClosable={false}
                    onCancel={() => this.setState({ visibleAssignTask: false })}>
                    <AssignTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} />
                </Modal>
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.inforLogin.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message,
    loadingTask: state.task.loading,
    loadingMember: state.family.loading,
    loadingTaskCate: state.taskCate.loading,
    loadingGetAllTask: state.task.loadingGetAllTask,
})

const actionCreators = {
    getRecentTask: taskActions.getRecentTask,
    completeTask: taskActions.completeTask,
    redoTask: taskActions.redoTask,
}

export default connect(mapStateToProps, actionCreators)(TaskList);