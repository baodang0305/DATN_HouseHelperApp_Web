import React, { Component } from 'react'
import './ActionDoneTask.css';

import { Modal, Button, Avatar } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import ImgAvatar from '../../../assets/avatar.jpg'

const { confirm } = Modal;



function showDoneTaskForm(idTask, usersTask) {
    confirm({
        title: 'Who did completed this task?',
        okText: 'Complete',
        icon: <CheckCircleOutlined style={{ color: '#9DCC80' }} />,
        content: <div className="form-done-task">

            <div className="avatar-member-done">
                {usersTask.map(item =>
                    <Avatar style={{ width: 50, height: 50 }} className="icon-avatar" src={item.mID.mAvatar} />)}


            </div>

        </div>,
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() { },
    });
}
export default showDoneTaskForm;