import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, DatePicker, TimePicker, Row, Col, Select, Avatar } from 'antd'

import ImgAvatar from '../../../assets/avatar.jpg'
import moment from 'moment';
const { Option } = Select;
const config = {
    rules: [
        {
            type: 'object',
            required: true,
            message: 'Please select time!',
        },
    ],
};
export default class FormCreateTask extends Component {

    render() {

        return (
            <div>

                <Form
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}

                >
                    <Form.Item
                        label="Task name"
                        name="taskname"
                        rules={[{ message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ message: 'Please input your password!' }]}
                    >
                        <Input.TextArea cols={2} />
                    </Form.Item>
                    <Row gutter={15}>
                        <Col span={14}>
                            <Form.Item name="date-time-picker" label="Set time" >
                                <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="date-time-remind" label="Remind" >
                                <TimePicker defaultValue={moment('12:08:23', 'HH:mm:ss')} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={15}>
                        <Col span={14}>
                            <Form.Item name="assign-member" label="Assign" >
                                <Avatar src={ImgAvatar}></Avatar>
                                <Avatar src={ImgAvatar}></Avatar>
                                <Avatar src={ImgAvatar}></Avatar>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item name="point-task" label="Point" >
                                <Select defaultValue="5" style={{ width: 120 }}>
                                    <Option value="5">5</Option>
                                    <Option value="10">10</Option>
                                    <Option value="15" >
                                        15
      </Option>
                                    <Option value="20">20</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                </Form>

            </div>
        )
    }
}
