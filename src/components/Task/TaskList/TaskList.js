import React from 'react'
import { List, Avatar, Button, Skeleton, Col, Row, Modal, message } from 'antd';
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
    ArrowUpOutlined
} from '@ant-design/icons';
import moment from 'moment';
import CompleteTaskForm from '../ActionTask/ActionCompleteTask';
import RemindTaskForm from '../ActionTask/ActionRemindTask';
import DismissTaskForm from '../ActionTask/ActionDismissTask';
import DeleteTaskForm from '../ActionTask/ActionDeleteTask';
import { Link, Redirect } from 'react-router-dom';
import { taskActions } from '../../../actions/task.actions';


class TaskList extends React.Component {
    state = {
        initLoading: true,

        hiddenActionsList: true,
        index: '',
        visibleCompleteTask: false,
        visibleDismissTask: false,
        visibleRemindTask: false,
        visibleDeleteTask: false,
        nameTask: '',
        dataTemp: { idTask: '', nameTask: '', memberUser: null },

    };


    componentWillReceiveProps(nextProps) {
        nextProps.messageType === 'success' ? this.setState({
            visibleCompleteTask: false,
            visibleDismissTask: false,
            visibleRemindTask: false,
            visibleDeleteTask: false,
        }) : null
    }

    showActionTaskForm(visibleTypeForm) {
        if (visibleTypeForm === 'complete') {
            this.setState({ visibleCompleteTask: true });
        }
        else if (visibleTypeForm === 'dismiss') {
            this.setState({ visibleDismissTask: true });
        }
        else if (visibleTypeForm === 'remind') {
            this.setState({ visibleRemindTask: true });
        }
        else if (visibleTypeForm === 'delete') {
            this.setState({ visibleDeleteTask: true });
        }

    }
    closeActionTaskForm(visibleTypeForm) {
        if (visibleTypeForm === 'complete') {
            this.setState({ visibleCompleteTask: false });
        }
        else if (visibleTypeForm === 'dismiss') {
            this.setState({ visibleDismissTask: false });
        }
        else if (visibleTypeForm === 'remind') {
            this.setState({ visibleRemindTask: false });
        }
        else if (visibleTypeForm === 'delete') {
            this.setState({ visibleDeleteTask: false });
        }
    }

    render() {

        const { hiddenActionsList,

            index,
            visibleCompleteTask,
            visibleDismissTask,
            visibleRemindTask,
            visibleDeleteTask, dataTemp
        } = this.state;

        const { dataTasks, actionTask, user } = this.props;
        console.log('adqwd', dataTemp)

        return (
            <div>

                <List
                    itemLayout="horizontal"
                    pagination={{
                        pageSize: 5
                    }}
                    dataSource={dataTasks}
                    renderItem={item => (
                        <List.Item style={{ height: 90, paddingBottom: 5 }}
                            onClick={(e) => {
                                this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id, dataTemp: { idTask: item._id, nameTask: item.name, memberUser: item.assign } })
                                this.props.getRecentTask(item)
                            }}
                            actions={item.state === 'todo' ? [

                                <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                    <div className="list-action done-action"
                                        onClick={() => (this.setState({ visibleCompleteTask: true }))}
                                    >
                                        <div>
                                            <CheckOutlined style={{ color: '#09ed37', fontSize: 20 }} />
                                        </div>
                                        <div>Complete</div>
                                    </div>
                                    <div className="list-action dismiss-action"
                                        onClick={() => (this.setState({ visibleDismissTask: true }))}
                                    >
                                        <div><StopOutlined style={{ color: '#F8DA74', fontSize: 20 }} /></div>
                                        <div>Dismiss</div>
                                    </div>
                                    <div className="list-action nudge-action"
                                        onClick={() => (this.setState({ visibleRemindTask: true }))}
                                    >
                                        <div><AlertOutlined style={{ color: 'orange', fontSize: 20 }} /></div>
                                        <div>Remind</div>
                                    </div>
                                    <div className="list-action edit-action"
                                        onClick={() => history.push("/edit-task")}>
                                        <div><EditOutlined style={{ color: '##756f6d', fontSize: 20 }} /></div>
                                        <div>Edit</div>

                                    </div>
                                    <div className="list-action delete-action"
                                        onClick={(e) => {

                                            this.setState({ visibleDeleteTask: true, })
                                        }}>
                                        <div><DeleteOutlined style={{ color: '#EC6764', fontSize: 20 }} /></div>
                                        <div>Delete</div>
                                    </div>
                                </div>
                            ] : [
                                    <div hidden={item._id === index ? hiddenActionsList : true} className="actions">
                                        <div className="list-action redo-action"
                                            onClick={(e) => {
                                                this.setState({ visibleDeleteTask: true, })
                                            }}>
                                            <div><ArrowUpOutlined style={{ color: '#2295FF', fontSize: 20 }} /></div>
                                            <div>Redo task</div>
                                        </div>
                                    </div>
                                ]}>
                            <Skeleton avatar title={false} loading={item.loading} active>

                                <div className="detail-task">
                                    <Row gutter={10} style={{ width: '100%', paddingBottom: 5 }}>
                                        <Col span={10} hidden={item._id === index ? (hiddenActionsList === true ? false : true) : false}>
                                            <div className="infor-task">
                                                <div className="name-task">{item.name}<span style={{ fontSize: 13, fontWeight: 500, color: 'green' }}>&nbsp;{" - " + item.tcID.name}</span></div>
                                                <div className="note-task" hidden={item.notes === null ? true : false}><SnippetsOutlined style={{ fontSize: 16 }} />&nbsp;{item.notes}</div>
                                                <div className="time-task">{item.date === null ? `${'Did not create'}` : moment(`${item.date.lastDueDate}`).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                            </div>
                                        </Col>
                                        <Col span={4} className="show-image-task" hidden={item._id === index ? (hiddenActionsList === true ? false : true) : false}>
                                            <img className="image-task" src={item.photo} alt="" hidden={item.photo === null ? true : false} />
                                        </Col>
                                        <Col flex="auto" className="show-assign-action-task">
                                            <div className="icon-assigned-point">
                                                <div className="icon-assigned">

                                                    {item.assign !== null ? item.assign.mAssigns.map(item =>
                                                        <div className="container-icon-avatar">
                                                            <Avatar className="icon-avatar" src={item.mID.mAvatar} />
                                                            <span className='icon-avatar-show-name'>{item.mID.mName}</span>
                                                        </div>) : <div></div>}
                                                </div>

                                                <div className="task-point">
                                                    <span><StarOutlined className="icon-task-point" /></span>
                                                    <span className="point">&nbsp;{item.points} points</span>
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
                    <DeleteTaskForm idTask={dataTemp.idTask} nameTask={dataTemp.nameTask} memberDelete={dataTemp.memberUser !== null ? dataTemp.memberUser.mAssigns[0] : []} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    deleted: state.task.deleted,
    actionTask: state.task.actionTask,
    user: state.authentication.user,
    messageType: state.alert.type,
    messageAlert: state.alert.message
})

const actionCreators = {
    getRecentTask: taskActions.getRecentTask

}

export default connect(mapStateToProps, actionCreators)(TaskList);