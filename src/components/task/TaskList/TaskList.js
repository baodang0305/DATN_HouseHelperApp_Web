import React from 'react'
import { List, Avatar, Button, Skeleton } from 'antd';

import AvatarImg from '../../../assets/avatar.jpg';
import AvatarImg2 from '../../../assets/avatar2.jpg';
import './TaskList.css'

import { EditOutlined, CloseOutlined, DeleteOutlined, CheckOutlined, StopOutlined, AlertOutlined, StarOutlined } from '@ant-design/icons';
import moment from 'moment';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const dataTemp = [
    { id: 1, taskName: 'Do the laundry', assignedMember: ['VB', 'GB'], points: 15, status: 'todo' },
    { id: 2, taskName: 'Wash the dishes', assignedMember: ['VB', 'GB'], points: 10, status: 'todo' },
    { id: 3, taskName: 'Tidy up the room', assignedMember: ['VB', 'GB'], points: 20, status: 'todo' },
    { id: 5, taskName: 'Do the cooking for lunch', assignedMember: ['VB', 'GB'], points: 15, status: 'completed' },
    { id: 6, taskName: 'Clean the house', assignedMember: ['VB', 'GB'], points: 15, status: 'todo' }
]

class TaskList extends React.Component {
    state = {
        initLoading: true,
        loading: false,
        data: dataTemp,
        list: dataTemp,
        hiddenActionsList: true,
        index: ''
    };



    render() {
        const { list, hiddenActionsList, index } = this.state;
        console.log(list);

        return (
            <List
                className="demo-loadmore-list"

                itemLayout="horizontal"

                dataSource={list}
                renderItem={item => (
                    <List.Item key={item.id} style={{ height: 75 }}
                        onClick={(e) => this.setState({ hiddenActionsList: !hiddenActionsList, index: item.id })}
                        actions={[
                            <div key={item.id} hidden={item.id === index ? hiddenActionsList : true} className="actions">
                                <div className="list-action done-action">
                                    <div><CheckOutlined style={{ color: '#9DCC80', fontSize: 18 }} /></div>
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
                            <div className="content">
                                <div className="infor-task">
                                    <div className="name-task">{item.taskName}</div>
                                    <div className="time-task">{moment().format('MMMM Do YYYY, h:mm:ss a')}</div>
                                </div>
                                <div className="icon-assigned-point">
                                    <div className="icon-assigned">
                                        <Avatar className="icon-avatar" src={AvatarImg} />
                                        <Avatar className="icon-avatar" src={AvatarImg2} />
                                    </div>

                                    <div className="task-point"><span><StarOutlined className="icon-task-point" /></span><span className="point">&nbsp;{item.points} points</span></div>
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