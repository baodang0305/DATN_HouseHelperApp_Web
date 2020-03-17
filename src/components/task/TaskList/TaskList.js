import React from 'react'
import { List, Avatar, Button, Skeleton } from 'antd';

import AvatarImg from '../../../assets/avatar.jpg';
import './TaskList.css'
import reqwest from 'reqwest';
import { EditOutlined, CloseOutlined, DeleteOutlined, CheckOutlined, StopOutlined, AlertOutlined, StarOutlined } from '@ant-design/icons';

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
                    <List.Item key={item.id}

                        actions={[
                            <div key={item.id} hidden={item.id === index ? hiddenActionsList : true} className="actions">
                                <div className="list-action list-delete">
                                    <div><CheckOutlined /></div>
                                    <div>Finish</div>
                                </div>
                                <div className="list-action list-delete">
                                    <div><StopOutlined /></div>
                                    <div>Dismiss</div>
                                </div>
                                <div className="list-action list-delete">
                                    <div><AlertOutlined /></div>
                                    <div>Remind</div>
                                </div>
                                <div className="list-action list-edit">
                                    <div><EditOutlined /></div>
                                    <div>Edit</div>
                                </div>
                                <div className="list-action list-delete">
                                    <div><DeleteOutlined /></div>
                                    <div>Delete</div>
                                </div>
                            </div>
                        ]}
                    >
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <div className="content" onClick={(e) => this.setState({ hiddenActionsList: !hiddenActionsList, index: item.id })}>
                                <div className="content-task">
                                    <div>{item.taskName}</div>
                                </div>
                                <div className="icon-assigned-member">
                                    <Avatar src={AvatarImg} />
                                    <div className="task-point"><span><StarOutlined /></span><span>&nbsp;{item.points} points</span></div>
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