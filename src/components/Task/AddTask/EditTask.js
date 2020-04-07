import React, { Component } from 'react'

import './AddTask.css';

import {
    Form, Input, Button, Checkbox, DatePicker,
    TimePicker, Row, Col, Select, Avatar, Divider, Layout, message
} from 'antd';
import { connect } from 'react-redux';
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import {
    PlusOutlined,
    TeamOutlined,
    LeftOutlined,
    CheckOutlined, AppstoreOutlined
} from '@ant-design/icons';
import ImgAvatar from '../../../assets/avatar.jpg'
import moment, { duration } from 'moment';
import axios from 'axios';
import UploadImage from '../../Common/UploadImage/UploadImage';
import history from "../../../helpers/history";
import token from '../../../helpers/token';
import FormItem from 'antd/lib/form/FormItem';
import { taskActions } from '../../../actions/task.actions'

const { Option } = Select;
const { Header, Footer, Content } = Layout;


let index = 0;
const styleAssignedMember = 'width: 60, height: 60';
class FormEditTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsHowLong: [5, 10, 15, 20],
            itemsPoints: [5, 10, 15, 20],
            dueTime: null,
            remindTime: null,
            dataForSelectInput: '',
            hiddenCheckAssign: true,
            keyMember: [],
            listMembers: [],
            nameTask: '',
            assignMemberTask: { mAssigns: [], isBoth: false },
            dateTask: {},
            photoTask: null,
            timeTask: 0,
            pointsTask: 0,
            tcIDTask: "5e7f601c1c9d440000af791c",
            notesTask: '',
            listTaskCate: [],
            keyTaskCate: ["5e7f601c1c9d440000af791c"]
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }


    componentDidMount() {
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-member', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ listMembers: data.listMembers, });
            })
            .catch(err => console.log(err));
        axios.get(
            'https://househelperapp-api.herokuapp.com/list-task-category', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => {
                const data = res.data;
                console.log(data);
                this.setState({ listTaskCate: data.listTaskCategories });
            })
            .catch(err => console.log(err));
        const { recentTask } = this.props;

        const listAssignedMember = recentTask.assign.mAssigns.map(item => item.mID._id);
        this.setState({ keyMember: listAssignedMember })
    }


    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }


    handleClickBack = () => {
        history.goBack();
    }

    onNameChange = event => {
        this.setState({
            dataForSelectInput: event.target.value,
        });
    };

    handleOnChangeSelectHowLong = value => {
        this.setState({ timeTask: value })
    };

    handleOnChangeSelectPoint = value => {
        this.setState({ pointsTask: value })
    }

    addItemHowLong = () => {
        console.log('addItem');
        const { itemsHowLong, dataForSelectInput } = this.state;

        const i = itemsHowLong.indexOf(dataForSelectInput);

        if (i !== -1) {
            this.setState({
                itemsHowLong: [...itemsHowLong, dataForSelectInput || `New item ${index++}`],
                dataForSelectInput: '',
            });
        }

    };

    addItemPoints = () => {
        console.log('addItem');
        const { itemsPoints, dataForSelectInput } = this.state;
        const i = itemsPoints.indexOf(dataForSelectInput);

        i !== -1 ?
            this.setState({
                itemsPoints: [...itemsPoints, dataForSelectInput || `New item ${index++}`],
                dataForSelectInput: '',
            }) : null
    };

    handledChangeCate = (indexItem) => {
        const { keyTaskCate } = this.state;
        const i = keyTaskCate.indexOf(indexItem);
        if (i === -1) {
            this.setState({ keyTaskCate: [indexItem], tcIDTask: indexItem });
        }

    }
    handledChangeAvatar = (indexItem) => {
        const { keyMember } = this.state;
        const i = keyMember.indexOf(indexItem);
        if (i !== -1) {
            keyMember.splice(i, 1);
            this.setState({
                keyMember: keyMember, assignMemberTask: { mAssigns: keyMember, isBoth: false }
            });


        } else {
            this.setState({ keyMember: [...keyMember, indexItem], assignMemberTask: { mAssigns: [...keyMember, indexItem], isBoth: true } });

        }

    }

    handleOnChangeDatePicker = (value, dateString) => {
        this.setState({ dueTime: new Date(dateString) }, this.setState({
            dateTask: {
                lastDueDate: new Date(dateString)
                , reminder: this.state.remindTime
            }
        }))

    }

    handleOnChangeTimePicker = (value, timeString) => {

        this.setState({ remindTime: new Date(timeString) }, this.setState({
            dateTask: {
                lastDueDate: this.state.dueTime, reminder: new Date(timeString)
            }
        }))
    }

    handleSubmit = () => {
        const {
            nameTask,
            assignMemberTask,
            dateTask,
            photoTask,
            timeTask,
            pointsTask,
            tcIDTask,
            notesTask
        } = this.state;

        const { addTask } = this.props;
        console.log(nameTask,
            assignMemberTask,
            dateTask,
            photoTask,
            timeTask,
            pointsTask,
            tcIDTask,
            notesTask)

        addTask(nameTask, assignMemberTask, dateTask, photoTask, timeTask, pointsTask, tcIDTask, notesTask);

    }
    render() {
        const { itemsHowLong, itemsPoints, dataForSelectInput, hiddenCheckAssign, listMembers, keyMember,
            keyTaskCate, listTaskCate
        } = this.state;

        const { recentTask } = this.props;
        console.log(recentTask)
        let classNameForAssignMember = ["icon-avatar-member"];
        if (!this.state.hiddenCheckAssign) {
            classNameForAssignMember.push('avatar-checked-assign-member');
        }
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="3" />
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        <Row style={{ textAlign: "center" }}>
                            <Col flex="30px">
                                <Button style={{ marginLeft: "20px" }} onClick={this.handleClickBack} size="large"><LeftOutlined style={{ fontSize: 19 }} /></Button>

                            </Col>
                            <Col flex="auto">
                                <div className="title-header">Edit task</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '20px 20px' }}>
                        <div className="site-layout-background container-add-task" style={{ padding: '20px 40px', minHeight: 360 }}>
                            <Form
                                onFinish={this.handleSubmit}
                                className="container-form-add-task"
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}>
                                <Form.Item
                                    rules={[{ message: 'Please input your task!' }]}>
                                    <Input
                                        defaultValue={recentTask.name}
                                        name="nameTask"
                                        onChange={this.handleInputChange}
                                        size="large" placeholder="Task name" />
                                </Form.Item>
                                <Form.Item label={
                                    keyTaskCate.length > 0 ?
                                        <div style={{ fontSize: 16, color: '#2295FF' }}><AppstoreOutlined style={{ fontSize: 17 }} />&nbsp;Assign</div> :
                                        <div style={{ fontSize: 16 }}><AppstoreOutlined style={{ fontSize: 17 }} />&nbsp;Categories</div>

                                } >
                                    <div className="filter-list-task">

                                        {listTaskCate.map(item =>
                                            (<div className="list-cate-task">
                                                <div className="avatar-member" onClick={(e) => {
                                                    this.handledChangeCate(item._id)
                                                }
                                                }>
                                                    <Avatar src={item.image} className="icon-avatar-member"></Avatar>
                                                    <CheckOutlined
                                                        className="icon-check-assign-member"
                                                        hidden={keyTaskCate.indexOf(item._id) !== -1 ? false : true} />
                                                </div>
                                                <div>{item.name}</div>
                                            </div>))}

                                    </div>
                                </Form.Item>
                                <Form.Item>
                                    <Row gutter={15}>
                                        <Col span={12}>
                                            <Select
                                                onChange={this.handleOnChangeSelectHowLong}
                                                defaultValue={recentTask.time + ' ' + 'minutes'}

                                                size="large"
                                                style={{ width: '100%' }}
                                                placeholder="How long?"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <Input style={{ flex: 'auto' }} value={dataForSelectInput} placeholder="Number for minutes" onChange={this.onNameChange} />
                                                            <a
                                                                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                                onClick={this.addItemHowLong}
                                                            >
                                                                <PlusOutlined /> Add</a>
                                                        </div>
                                                    </div>
                                                )}
                                            >
                                                {itemsHowLong.map(item => (
                                                    <Option key={item}>{item} minutes</Option>
                                                ))}
                                            </Select>

                                        </Col>
                                        <Col span={12}>
                                            <Select
                                                onChange={this.handleOnChangeSelectPoint}
                                                size="large"
                                                defaultValue={recentTask.points + ' ' + 'points'}
                                                style={{ width: '100%' }}
                                                placeholder="Points"
                                                dropdownRender={menu => (
                                                    <div>
                                                        {menu}
                                                        <Divider style={{ margin: '4px 0' }} />
                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                            <Input style={{ flex: 'auto' }} value={dataForSelectInput} onChange={this.onNameChange} placeholder="Number for points" />
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
                                                    <Option key={item}>{item} points</Option>
                                                ))}
                                            </Select></Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item name="assign-member" label={<div style={{ fontSize: 15 }}><TeamOutlined />&nbsp;Assign</div>} >
                                    <div className="list-avatar-member">
                                        {listMembers.map(item =>
                                            <div className="container-avatar-member">
                                                <div className="avatar-member"
                                                    onClick={(e) => {
                                                        this.handledChangeAvatar(item._id)
                                                    }
                                                    }>
                                                    <Avatar className="icon-avatar-member" src={item.mAvatar} />
                                                    <CheckOutlined
                                                        className="icon-check-assign-member"
                                                        hidden={
                                                            keyMember.indexOf(item._id) !== -1 ? false : true} />
                                                </div>
                                                <div className='name-avatar-member'>{item.mName}</div>
                                            </div>)}
                                    </div>
                                </Form.Item>
                                <Form.Item>
                                    <Row gutter={15}>
                                        <Col span={12}>
                                            <Form.Item name="date-time-picker" >
                                                <DatePicker

                                                    defaultValue={recentTask.date === null ? null : moment(`${recentTask.date.lastDueDate}`, "YYYY-MM-DD HH:mm")}
                                                    onChange={this.handleOnChangeDatePicker}
                                                    name="dateTask" style={{ width: '100%' }} placeholder="Due time" showTime format="YYYY-MM-DD HH:mm:ss" size="large" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item name="date-time-remind" >
                                                <DatePicker showTime
                                                    defaultValue={recentTask.date === null ? null : moment(`${recentTask.date.reminder}`, "YYYY-MM-DD HH:mm")}
                                                    onChange={this.handleOnChangeTimePicker}
                                                    style={{ width: '100%' }} size="large" placeholder="Reminder" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <UploadImage />
                                </Form.Item>

                                <Form.Item

                                    name="description"
                                    rules={[{ message: 'Please input your notes of task!' }]}
                                >
                                    <Input.TextArea value={recentTask.notes} name="notesTask" onChange={this.handleInputChange} placeholder="More detail information" cols={2} />
                                </Form.Item>
                                <Form.Item>
                                    <div className="button-add-task-form">
                                        <Button type="default" size="large" style={{ marginRight: 10 }}>Cancel</Button>
                                        <Button htmlType="submit" type="primary" size="large">Save</Button>
                                    </div>
                                </Form.Item>
                            </Form>

                        </div>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Layout>

        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.user,
    messageAlert: state.alert.type,
    recentTask: state.task.recentTask
})
const actionCreators = {
    addTask: taskActions.addTask
}
export default connect(mapStateToProps, actionCreators)(FormEditTask)