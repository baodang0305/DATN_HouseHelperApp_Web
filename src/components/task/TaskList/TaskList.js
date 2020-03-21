import React from 'react'
import { List, Avatar, Button, Skeleton, Col, Row } from 'antd';

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

} from '@ant-design/icons';
import moment from 'moment';
import showDoneTaskForm from '../ActionTask/ActionDoneTask';


class TaskList extends React.Component {
    state = {
        initLoading: true,
        loading: false,

        hiddenActionsList: true,
        index: ''
    };
    render() {
        const { hiddenActionsList, index } = this.state;
        const { dataTasks } = this.props;

        return (
            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={dataTasks}
                renderItem={item => (
                    <List.Item key={item._id} style={{ height: 90, paddingBottom: 5 }}
                        onClick={(e) => this.setState({ hiddenActionsList: !hiddenActionsList, index: item._id })}
                        actions={[
                            <div hidden={item._id === index ? hiddenActionsList : true} className="actions">

                                <div className="list-action done-action"
                                    onClick={() => showDoneTaskForm(item._id, item.versions[0].assign.mAssigns)}>
                                    <div>
                                        <CheckOutlined style={{ color: '#9DCC80', fontSize: 18 }} />
                                    </div>
                                    <div>Finish</div>
                                </div>
                                <div className="list-action dismiss-action">
                                    <div><StopOutlined style={{ color: '#F8DA74', fontSize: 18 }} /></div>
                                    <div>Dismiss</div>
                                </div>
                                <div className="list-action delete-action">
                                    <div><AlertOutlined style={{ color: 'orange', fontSize: 18 }} /></div>
                                    <div>Remind</div>
                                </div>
                                <div className="list-action edit-action">
                                    <div><EditOutlined style={{ color: '#C3C8CE', fontSize: 18 }} /></div>
                                    <div>Edit</div>
                                </div>
                                <div className="list-action delete-action">
                                    <div><DeleteOutlined style={{ color: '#EC6764', fontSize: 18 }} /></div>
                                    <div>Delete</div>
                                </div>

                            </div>
                        ]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>

                            <div className="detail-task">
                                <Row gutter={10} style={{ width: '100%' }}>
                                    <Col span={10}>
                                        <div className="infor-task">
                                            <div className="name-task">{item.versions[0].name}</div>
                                            <div className="note-task"><SnippetsOutlined style={{ fontSize: 16 }} />&nbsp;{item.versions[0].notes}</div>
                                            <div className="time-task">{item.versions[0].date.lastDueDate === null ? `${'Did not create'}` : moment(`${item.versions[0].date.lastDueDate}`).format('MMMM Do YYYY, h:mm:ss a')}</div>
                                        </div>
                                    </Col>
                                    <Col span={4}>
                                        <img className="image-task" src="" alt="" />
                                    </Col>
                                </Row>

                                <div className="icon-assigned-point">
                                    <div className="icon-assigned">

                                        {item.versions[0].assign.mAssigns.map(item =>
                                            <div className="container-icon-avatar">
                                                <Avatar className="icon-avatar" src={item.mID.mAvatar} />
                                                <span className='icon-avatar-show-name'>{item.mID.mName}</span>
                                            </div>)}
                                    </div>

                                    <div className="task-point">
                                        <span><StarOutlined className="icon-task-point" /></span>
                                        <span className="point">&nbsp;{item.versions[0].points} points</span>
                                    </div>
                                </div>

                            </div>

                        </Skeleton>
                    </List.Item>
                )}
            />
        );
    }
}
export default TaskList;