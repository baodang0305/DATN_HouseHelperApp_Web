import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, DatePicker, TimePicker, Row, Col, Select, Avatar, Divider } from 'antd'


import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import ImgAvatar from '../../../assets/avatar.jpg'
import moment from 'moment';
import UploadImage from '../../Common/UploadImage/UploadImage';
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

let index = 0;
export default class FormCreateTask extends Component {
    state = {
        itemsHowLong: ['5 mins', '10 mins', '15 mins', '20 mins'],
        itemsPoints: ['5 points', '10 points', '15 points'],
        name: '',
    };

    onNameChange = event => {
        this.setState({
            name: event.target.value,
        });
    };

    addItemHowLong = () => {
        console.log('addItem');
        const { itemsHowLong, name } = this.state;
        this.setState({
            itemsHowLong: [...itemsHowLong, name || `New item ${index++}`],
            name: '',
        });
    };

    addItemPoints = () => {
        console.log('addItem');
        const { itemsPoints, name } = this.state;
        this.setState({
            itemsPoints: [...itemsPoints, name || `New item ${index++}`],
            name: '',
        });
    };
    render() {
        const { itemsHowLong, itemsPoints, name } = this.state;
        return (
            <div>

                <Form
                    layout="vertical"
                    name="basic"
                    initialValues={{ remember: true }}

                >
                    <Form.Item

                        name="taskname"
                        rules={[{ message: 'Please input your username!' }]}

                    >
                        <Input size="large" placeholder="Task name" />
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={15}>
                            <Col span={12}>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    placeholder="How long?"
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                <Input style={{ flex: 'auto' }} value={name} placeholder="Number for minutes" onChange={this.onNameChange} />
                                                <a
                                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                    onClick={this.addItemHowLong}
                                                >
                                                    <PlusOutlined /> Add
              </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {itemsHowLong.map(item => (
                                        <Option key={item}>{item}</Option>
                                    ))}
                                </Select>

                            </Col>
                            <Col span={12}>
                                <Select
                                    size="large"
                                    style={{ width: '100%' }}
                                    placeholder="Points"
                                    dropdownRender={menu => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} placeholder="Number for points" />
                                                <a
                                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                    onClick={this.addItemPoints}
                                                >
                                                    <PlusOutlined /> Add
                                            </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {itemsPoints.map(item => (
                                        <Option key={item}>{item}</Option>
                                    ))}
                                </Select></Col>
                        </Row>
                    </Form.Item>
                    <Form.Item name="assign-member" label={<div style={{ fontSize: 15 }}><TeamOutlined />&nbsp;Assign</div>} >
                        <div>
                            <Avatar style={{ width: 50, height: 50 }} className="icon-avatar" src={ImgAvatar} />
                            <Avatar style={{ width: 50, height: 50 }} className="icon-avatar" src={ImgAvatar} />
                            <Avatar style={{ width: 50, height: 50 }} className="icon-avatar" src={ImgAvatar} />
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Row gutter={15}>
                            <Col span={12}>
                                <Form.Item name="date-time-picker" >
                                    <DatePicker placeholder="Due time" showTime format="YYYY-MM-DD HH:mm:ss" size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="date-time-remind" >
                                    <TimePicker style={{ width: '100%' }} size="large" placeholder="Reminder" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <UploadImage />
                    </Form.Item>




                    <Form.Item

                        name="description"
                        rules={[{ message: 'Please input your password!' }]}
                    >
                        <Input.TextArea placeholder="More detail information" cols={2} />
                    </Form.Item>
                </Form>

            </div>
        )
    }
}
