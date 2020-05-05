import React, { Component } from 'react'

import './AddTask.css';
import firebase from "firebase";

import {
    Form, Input, Button, Checkbox, DatePicker, Radio, Switch,
    TimePicker, Row, Col, Select, Avatar, Divider, Layout, Tooltip, Alert
} from 'antd';
import { connect } from 'react-redux';
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import {
    PlusOutlined,
    TeamOutlined,
    LeftOutlined, ScheduleOutlined, RedoOutlined, AlertOutlined, CloseCircleOutlined,
    CheckOutlined, AppstoreOutlined, ClockCircleOutlined, StarOutlined, SnippetsOutlined, FrownOutlined
} from '@ant-design/icons';

import moment from 'moment';
import 'moment/locale/vi';
import axios from 'axios';
import history from "../../../helpers/history";

import { taskActions } from '../../../actions/task.actions';
import { indexConstants } from "../../../constants/index.constants";
import { storage } from "../../../helpers/firebaseConfig";


const { Option } = Select;
const { Header, Content } = Layout;
const { TextArea } = Input

let index = 0;
const checkDataInput = (data) => {
    return data === '' || data.trim() === '' ? false : true

}
class FormCreateTask extends Component {
    constructor(props) {
        super(props);
        const { idCommonTaskCate } = this.props;
        this.state = {
            itemsHowLong: [5, 10, 15, 20],
            itemsPoints: [5, 10, 15, 20],
            itemsRemindTime: [20, 30, 40],
            dueTime: null,
            keyMember: [],
            nameTask: '',
            assignMemberTask: { mAssigns: [], isAll: false },
            dueDateTask: null,
            remindTimeTask: null,
            photoTask: null,
            timeTask: 0,
            pointsTask: 0,
            tcIDTask: idCommonTaskCate,
            notesTask: '',
            penaltyTask: 0,
            repeatTask: null,
            typeRepeatTask: null,
            startRepeatTask: null,
            keyTaskCate: [idCommonTaskCate],
            currentUrlImg: indexConstants.UPLOAD_IMG,
            dataAddHowLong: '',
            dataAddPoint: '',
            dataAddRemindTime: '',
            onChangedData: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChangeImg = (e) => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            photoTask: e.target.files[0]
        });
    }

    componentDidMount() {

        const { recentTask, type } = this.props;

        //clone data recent task after choosing edit action.
        type === 'edit' ?
            recentTask ? this.setState({
                keyMember: recentTask.assign !== null ? recentTask.assign.mAssigns.map(item => item.mID._id) : [],
                keyTaskCate: [recentTask.tcID._id],
                currentUrlImg: recentTask.photo,
                nameTask: recentTask.name,
                dueDateTask: recentTask.dueDate,
                penaltyTask: recentTask.penalty,
                repeatTask: recentTask.repeat,
                startRepeatTask: recentTask.repeat.start || null,
                typeRepeatTask: repeatTask.repeat.type || null,
                timeTask: recentTask.time,
                pointsTask: recentTask.points,
                tcIDTask: recentTask.tcID._id,
                notesTask: recentTask.notes,
                remindTimeTask: recentTask.reminder,
                assignMemberTask: recentTask.assign !== null
                    ? { mAssigns: recentTask.assign.mAssigns.map(item => item.mID._id), isAll: recentTask.assign.isAll }
                    : null
            }) : null
            : null

    }


    handleInputChange(event) {
        this.setState({ [event.target.name]: event.target.value, onChangedData: true });

    }


    handleClickBack = () => {
        history.goBack();
    }

    onAddPointChange = event => {
        this.setState({
            dataAddPoint: event.target.value,
        });
    };
    onAddHowLongChange = event => {
        this.setState({
            dataAddHowLong: event.target.value,
        });
    };
    onAddRemindTimeChange = event => {
        this.setState({
            dataAddRemindTime: event.target.value,
        });
    };

    handleOnChangeSelectTypeRepeat = value => {
        const { startRepeatTask } = this.state;
        this.setState({ typeRepeatTask: value }, () =>
            this.setState({ repeatTask: { start: startRepeatTask || null, type: value || null } })
        )

    }

    handleOnChangePenalty = value => {
        this.setState({ penaltyTask: Number(value) || 0 })
    }

    handleOnChangeSelectHowLong = value => {
        this.setState({ timeTask: Number(value) })
    };

    handleOnChangeTimeRemind = value => {
        this.setState({ remindTimeTask: Number(value) })
    }
    handleOnChangeSelectPoint = value => {
        this.setState({ pointsTask: Number(value) })
    }

    onChangeSwitchTypeAssign = (checked) => {
        const { assignMemberTask } = this.state;
        this.setState({ assignMemberTask: { mAssigns: assignMemberTask.mAssigns, isAll: checked }, })
    }
    addItemHowLong = () => {
        console.log('addItem');

        const { itemsHowLong, dataAddHowLong } = this.state;

        let i = itemsHowLong.indexOf(Number(dataAddHowLong));

        i === -1 ?
            this.setState({
                itemsHowLong: [...itemsHowLong, dataAddHowLong],
                dataAddHowLong: '',
            }) : null;


    };

    addItemRemindTime = () => {
        console.log('addItem');
        const { itemsRemindTime, dataAddRemindTime } = this.state;
        let i = itemsRemindTime.indexOf(Number(dataAddRemindTime));

        i === -1 ?
            this.setState({
                itemsRemindTime: [...itemsRemindTime, dataAddRemindTime],
                dataAddRemindTime: '',
            }) : null;


    };

    addItemPoints = () => {
        console.log('addItem');
        const { itemsPoints, dataAddPoint } = this.state;
        const i = itemsPoints.indexOf(Number(dataAddPoint));

        i === -1 ?
            this.setState({
                itemsPoints: [...itemsPoints, dataAddPoint || `New item ${index++}`],
                dataAddPoint: '',
            }) : null
    };

    handledChangeAvatar = (indexItem) => {
        const { keyMember } = this.state;
        const i = keyMember.indexOf(indexItem);
        if (i !== -1) {
            keyMember.splice(i, 1);
            this.setState({
                keyMember: keyMember, assignMemberTask: { mAssigns: keyMember, isAll: false }
            });


        } else {
            this.setState({ keyMember: [...keyMember, indexItem], assignMemberTask: { mAssigns: [...keyMember, indexItem], isAll: false } });

        }
    }
    handledChangeCate = (indexItem) => {
        const { keyTaskCate } = this.state;
        const i = keyTaskCate.indexOf(indexItem);
        if (i === -1) {
            this.setState({ keyTaskCate: [indexItem], tcIDTask: indexItem });
        }

    }

    handleOnChangeDatePicker = (value, dateString) => {
        this.setState({ dueDateTask: new Date(dateString) })

    }


    handleOnChangeStartRepeatDate = (value, timeString) => {
        const { typeRepeatTask } = this.state;
        this.setState({ startRepeatTask: new Date(timeString) || null }
            , () => this.setState({ repeatTask: { start: new Date(timeString), type: typeRepeatTask } }))
    }

    handleSubmit = () => {
        const {
            nameTask, assignMemberTask, dueDateTask, photoTask,
            timeTask, pointsTask, tcIDTask, notesTask, penaltyTask, repeatTask, remindTimeTask
        } = this.state;

        const { addTask, editTask, type, recentTask } = this.props;

        if (photoTask) {
            const uploadTask = storage.ref().child(`images/${photoTask.name}`).put(photoTask);
            uploadTask.on('state_changed', function (snapshot) {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED:
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING:
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                console.log(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                    const photoTaskTemp = downloadURL;
                    console.log('photo', photoTaskTemp, downloadURL)
                    type === 'add'
                        ? addTask(nameTask, assignMemberTask, dueDateTask, photoTaskTemp, timeTask, pointsTask, tcIDTask, notesTask, penaltyTask, repeatTask, remindTimeTask)
                        : editTask(recentTask._id, nameTask, timeTask, pointsTask, assignMemberTask, photoTaskTemp, tcIDTask, notesTask, dueDateTask, penaltyTask, repeatTask, remindTimeTask);
                });
            });
        }
        else {
            type === 'add'
                ? addTask(nameTask, assignMemberTask, dueDateTask, photoTask, timeTask, pointsTask, tcIDTask, notesTask, penaltyTask, repeatTask, remindTimeTask)
                : editTask(recentTask._id, nameTask, timeTask, pointsTask, assignMemberTask, recentTask.photo, tcIDTask, notesTask, dueDateTask, penaltyTask, repeatTask, remindTimeTask);
        }
    }

    allowTaskName = (taskName) => {
        const { onChangedData } = this.state;

        const { allTasks } = this.props;
        const checkExist = allTasks.filter(item => item.state === 'todo' || item.state === 'upcoming').map(item => item.name.trim().toLowerCase()).indexOf(taskName.trim().toLowerCase());
        if (onChangedData && (checkExist !== -1 || taskName === '' || taskName.trim() === '')) {
            return false
        }
        return true
    }
    render() {
        const { itemsRemindTime, itemsHowLong, itemsPoints, dataAddPoint, dataAddHowLong, dataAddRemindTime,
            keyMember, currentUrlImg,
            nameTask, assignMemberTask, penaltyTask, repeatTask, remindTimeTask,
            dueDateTask, photoTask, timeTask, pointsTask, tcIDTask, notesTask, keyTaskCate
        } = this.state;

        const { type, recentTask, allMembers, allTaskCates, loading } = this.props;
        console.log(nameTask,
            assignMemberTask,
            dueDateTask,
            photoTask,
            timeTask,
            pointsTask,
            tcIDTask,
            notesTask, penaltyTask, repeatTask, remindTimeTask)


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
                                <div className="title-header">{type === 'add' ? 'Tạo công việc' : 'Sửa công việc'}</div>
                            </Col>
                        </Row>
                    </Header>
                    <Content style={{ margin: '0 20px' }}>
                        <div className="container-add-task" style={{ minHeight: 360, backgroundColor: 'transparent' }}>
                            <Form
                                onFinish={this.handleSubmit}
                                className="container-form-add-task"
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}>

                                {/* Set up name of task - title of task */}
                                <Form.Item className="form-item-add" name="name-task"
                                    rules={[{ message: <div style={{ width: '100%', textAlign: 'center' }}>Tên công việc không được để trống</div> }]}>
                                    <Input className="input-item-add-task" defaultValue={type === 'edit' ? recentTask.name : null}
                                        name="nameTask" onChange={this.handleInputChange} size="large" placeholder="Tên công việc"
                                    />
                                </Form.Item>
                                {this.allowTaskName(nameTask) === false ? <Alert message="Tên công việc không đúng hoặc đã tồn tại" type="error" showIcon closable /> : null}
                                {/* Set up time and point*/}
                                <Form.Item style={{ padding: 0, margin: '10px 0' }}
                                    rules={[{ required: true, message: 'Please input your username!' }]}>
                                    <Row gutter={30} style={{ backgroundColor: 'transparent' }}>
                                        <Col span={12} >
                                            <div className="custom-select-add-task">
                                                <div className="present-select-add-task">
                                                    <ClockCircleOutlined style={{ fontSize: 25, color: 'white' }} />
                                                    <div className="show-data-select">{timeTask !== 0 ? timeTask + ' phút' : "Thời gian cần tốn?"}</div>
                                                </div>
                                                <Select className="select-item-add-task"
                                                    onChange={this.handleOnChangeSelectHowLong}
                                                    size="large"
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                                <Input style={{ flex: 'auto' }} value={dataAddHowLong} type="number" size="middle"
                                                                    placeholder="Number for minutes"
                                                                    onChange={this.onAddHowLongChange} />
                                                                <a className={checkDataInput(dataAddHowLong) ? null : 'disable-btn-add-task'}
                                                                    style={{ flex: 'none', display: 'block', cursor: 'pointer', marginLeft: 5, padding: '3px' }}
                                                                    onClick={this.addItemHowLong}>
                                                                    <PlusOutlined />&nbsp;Thêm
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}
                                                >
                                                    {itemsHowLong.map(item => (
                                                        <Option key={item}>{item} phút</Option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="custom-select-add-task">
                                                <div className="present-select-add-task">
                                                    <StarOutlined style={{ fontSize: 25, color: 'white' }} />
                                                    <div className="show-data-select">{pointsTask !== 0 ? pointsTask + ' điểm' : "Điểm thưởng"}</div>
                                                </div>
                                                <Select
                                                    className="select-item-add-task"
                                                    onChange={this.handleOnChangeSelectPoint}
                                                    size="large"
                                                    style={{ width: '100%' }}
                                                    placeholder="Điểm thưởng"
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                                                <Input style={{ flex: 'auto' }}
                                                                    size="middle"
                                                                    value={dataAddPoint} type="number"
                                                                    onChange={this.onAddPointChange} placeholder="Number for points" />
                                                                <a className={checkDataInput(dataAddPoint) ? null : 'disable-btn-add-task'}
                                                                    style={{ flex: 'none', padding: '3px', display: 'block', cursor: 'pointer' }}
                                                                    onClick={this.addItemPoints}>
                                                                    <PlusOutlined /> Thêm</a>
                                                            </div>
                                                        </div>
                                                    )}
                                                >
                                                    {itemsPoints.map(item => (
                                                        <Option key={item}>{item} điểm</Option>
                                                    ))}
                                                </Select>
                                            </div>

                                        </Col>
                                    </Row>
                                </Form.Item>
                                {/* Set up category for task */}
                                <Form.Item className="form-item-add"
                                    label={
                                        keyTaskCate.length > 0
                                            ? <div style={{ fontSize: 16, color: '#2295FF' }}><AppstoreOutlined style={{ fontSize: 17 }} />&nbsp;Loại công việc</div>
                                            : <div style={{ fontSize: 16 }}><AppstoreOutlined style={{ fontSize: 17 }} />&nbsp;Loại công việc</div>} >
                                    <div className="list-task-cate">

                                        {allTaskCates.map(item =>
                                            (<div key={item._id || null} className="task-cate-item">
                                                <div className="avatar-task-cate" onClick={(e) => {
                                                    this.handledChangeCate(item._id)
                                                }
                                                }>
                                                    <Avatar src={item.image} className={keyTaskCate.indexOf(item._id) !== -1 ? "icon-avatar-task-cate-checked" : "icon-avatar-task-cate"}></Avatar>
                                                    <CheckOutlined
                                                        className="icon-check-assign-task-cate"
                                                        hidden={keyTaskCate.indexOf(item._id) !== -1 ? false : true} />
                                                </div>
                                                <div>{item.name}</div>
                                            </div>))}
                                    </div>
                                </Form.Item>

                                {/* Set up assigned member for task */}

                                <Form.Item className="form-item-add" name="assign-member" label={
                                    keyMember.length > 0
                                        ? <div style={{ fontSize: 16, color: '#2295FF' }}>
                                            <TeamOutlined style={{ fontSize: 17 }} />&nbsp;Thành viên phụ trách

                                           {keyMember.length > 1
                                                ? <Tooltip placement="top" title="một người tùy chọn hay cùng nhau thực hiện" >
                                                    <Switch style={{ marginLeft: 15, position: 'absolute', right: 0 }} onChange={this.onChangeSwitchTypeAssign}
                                                        checkedChildren="cùng làm" unCheckedChildren="tùy chọn" />
                                                </Tooltip>
                                                : null}
                                        </div>
                                        : <div style={{ fontSize: 16, width: '100%' }}>
                                            <TeamOutlined style={{ fontSize: 17 }} />&nbsp;Thành viên phụ trách
                                        </div>} >

                                    <div className="list-avatar-member">
                                        {allMembers.map(item =>
                                            <div key={item._id} className="container-avatar-member">
                                                <div className="avatar-member"
                                                    onClick={(e) => {
                                                        this.handledChangeAvatar(item._id)
                                                    }
                                                    }>
                                                    <Avatar className={keyMember.indexOf(item._id) === -1 ? "icon-avatar-member" : "icon-avatar-member-checked"}
                                                        src={item.mAvatar.image} />
                                                    <CheckOutlined
                                                        className="icon-check-assign-member"
                                                        hidden={keyMember.indexOf(item._id) !== -1 ? false : true} />
                                                </div>
                                                <div className='name-avatar-member'>{item.mName}</div>
                                            </div>)}
                                    </div>


                                </Form.Item>

                                {/* Set up time of task */}
                                <Form.Item className="form-item-add">
                                    <Row gutter={[30]}>
                                        <Col span={12} >
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={10}>
                                                        <div className="present-select-date-add-task">
                                                            {repeatTask !== null
                                                                ? <div style={{ fontSize: 16, color: '#2985ff' }}>
                                                                    <RedoOutlined style={{ fontSize: 17 }} />&nbsp;Lặp lại
                                                            </div>
                                                                : <div style={{ fontSize: 16 }}><RedoOutlined style={{ fontSize: 17 }} />&nbsp;Lặp lại</div>
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Select size="large" name="repeatTask"
                                                            defaultValue={type === 'edit' ? recentTask.repeat : undefined}
                                                            onChange={this.handleOnChangeSelectTypeRepeat}
                                                            placeholder="Chọn kiểu lặp lại"
                                                            style={{ width: '100%' }} allowClear>
                                                            <Option key="norepeat" value={null}>Không lặp</Option>
                                                            <Option key="daily" value="daily">Hằng ngày</Option>
                                                            <Option key="weekly" value="weekly">Hằng tuần</Option>
                                                        </Select></Col>
                                                </Row>
                                            </div>
                                        </Col>
                                        {repeatTask ? <Col span={12}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={10}>
                                                        <div className="present-select-date-add-task">
                                                            {dueDateTask !== null
                                                                ? <div style={{ fontSize: 16, color: '#2985ff' }}><ScheduleOutlined style={{ fontSize: 17 }} />&nbsp;Thời gian bắt đầu</div>
                                                                : <div style={{ fontSize: 16 }}><ScheduleOutlined style={{ fontSize: 17 }} />&nbsp;Thời gian bắt đầu</div>
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col span={14}>
                                                        <DatePicker
                                                            defaultValue={type === 'edit'
                                                                ? recentTask.repeat.start === null ? null : moment(`${recentTask.repeat.start}`, "YYYY-MM-DD HH:mm")
                                                                : null
                                                            }
                                                            onChange={this.handleOnChangeStartRepeatDate}
                                                            allowClear={true}
                                                            size="large"
                                                            name="dueDateTask" style={{ width: '100%' }}
                                                            placeholder="Hạn cuối của công việc" showTime format="YYYY-MM-DD HH:mm:ss" />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col> : null}

                                        <Col span={12} style={{ marginTop: repeatTask ? 5 : 0 }}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={10}>
                                                        <div className="present-select-date-add-task">
                                                            {dueDateTask !== null
                                                                ? <div style={{ fontSize: 16, color: '#2985ff' }}><ScheduleOutlined style={{ fontSize: 17 }} />&nbsp;Hạn cuối</div>
                                                                : <div style={{ fontSize: 16 }}><ScheduleOutlined style={{ fontSize: 17 }} />&nbsp;Hạn công việc</div>
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col span={14}>
                                                        <DatePicker
                                                            defaultValue={type === 'edit'
                                                                ? recentTask.dueDate === null ? null : moment(`${recentTask.dueDate}`, "YYYY-MM-DD HH:mm")
                                                                : null
                                                            }
                                                            onChange={this.handleOnChangeDatePicker}
                                                            allowClear={true}
                                                            size="large"
                                                            name="dueDateTask" style={{ width: '100%' }}
                                                            placeholder="Hạn cuối của công việc" showTime format="YYYY-MM-DD HH:mm:ss" />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>{dueDateTask !== null
                                            ?
                                            <Col span={12} style={{ marginTop: 5 }}>

                                                <div className="custom-select-date-add-task">
                                                    <Row style={{ width: '100%' }}>
                                                        <Col span={10}>
                                                            <div className="present-select-date-add-task">
                                                                {remindTimeTask !== null
                                                                    ? <div style={{ fontSize: 16, color: '#2985ff' }}><AlertOutlined style={{ fontSize: 17 }} />&nbsp;Nhắc nhở trước hạn</div>
                                                                    : <div style={{ fontSize: 16 }}><AlertOutlined style={{ fontSize: 17 }} />&nbsp;Nhắc nhở trước hạn</div>}
                                                            </div>
                                                        </Col>
                                                        <Col span={14} >
                                                            <Select
                                                                onChange={this.handleOnChangeTimeRemind}
                                                                size="large"
                                                                placeholder="Chọn thời gian nhắc trước"
                                                                defaultValue={remindTimeTask !== null ? remindTimeTask + ' phút' : undefined}
                                                                dropdownRender={menu => (
                                                                    <div>
                                                                        {menu}
                                                                        <Divider style={{ margin: '4px 0' }} />
                                                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>

                                                                            <Input style={{ flex: 'auto' }}
                                                                                defaultValue={dataAddRemindTime ? dataAddRemindTime : null} type="number"
                                                                                placeholder="Nhập thời gian nhắc nhở"
                                                                                size="middle"
                                                                                onChange={this.onAddRemindTimeChange} />
                                                                            <a className={checkDataInput(dataAddRemindTime) ? null : 'disable-btn-add-task'}
                                                                                style={{ flex: 'none', padding: '3px', display: 'block', cursor: 'pointer' }}
                                                                                onClick={this.addItemRemindTime}>
                                                                                <PlusOutlined style={{ marginLeft: 10 }} />Thêm</a>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            >
                                                                {itemsRemindTime.map(item => (
                                                                    <Option key={item}>{item} phút</Option>
                                                                ))}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col> : null}

                                        <Col span={12} style={{ marginTop: 5 }}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col span={10}>
                                                        <div className="present-select-date-add-task">
                                                            {penaltyTask !== null
                                                                ? <div style={{ fontSize: 16, color: '#2985ff' }}>
                                                                    <FrownOutlined style={{ fontSize: 17 }} />&nbsp;Điểm phạt</div>
                                                                : <div style={{ fontSize: 16 }}><FrownOutlined style={{ fontSize: 17 }} />&nbsp;Điểm phạt</div>
                                                            }
                                                        </div>
                                                    </Col>
                                                    <Col span={14}>
                                                        <Select size="large" name="penaltyTask"
                                                            defaultValue={type === 'edit' ? recentTask.penalty + ' %' : "0"}
                                                            placeholder="Chọn số điểm trừ" onChange={this.handleOnChangePenalty}
                                                            style={{ width: '100%' }} allowClear>
                                                            <Option key="0" value="0">Không trừ điểm</Option>
                                                            <Option key="10" value="10">Trừ 10%</Option>
                                                            <Option key="20" value="20">Trừ 20%</Option>
                                                        </Select>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>

                                </Form.Item>

                                {/* Upload image for task */}
                                <Form.Item className="form-item-add">
                                    <div className="add-task-list-img">
                                        <div className="show-upload-img">
                                            {currentUrlImg !== indexConstants.UPLOAD_IMG
                                                ? <img src={currentUrlImg} className="after-upload-img" />
                                                : <div className="add-task-img">
                                                    <img src={currentUrlImg} className="upload-img" />
                                                    <span className="tt-upload-img">Hình ảnh</span>
                                                </div>
                                            }
                                        </div>

                                        <input onChange={this.handleChangeImg} type="file" className="input-add-task-img" />
                                    </div>
                                </Form.Item>

                                {/* Note or detail task */}
                                <Form.Item className="form-item-add"
                                    label={
                                        notesTask !== '' || null
                                            ? <div style={{ fontSize: 16, color: '#2295FF' }}><SnippetsOutlined style={{ fontSize: 17 }} />&nbsp;Ghi chú:</div>
                                            : <div style={{ fontSize: 16 }}><SnippetsOutlined style={{ fontSize: 17 }} />&nbsp;Ghi chú</div>} >
                                    <TextArea name="notesTask"
                                        defaultValue={type === 'edit'
                                            ? recentTask.notes === null ? '' : recentTask.notes
                                            : null
                                        }
                                        onChange={this.handleInputChange}
                                        placeholder="Chi tiết công việc" cols={2} />
                                </Form.Item>

                                <Form.Item className="form-item-add">
                                    <div className="button-add-task-form">
                                        <Button type="default" size="large" style={{ marginRight: 10 }}>Hủy</Button>
                                        <Button htmlType="submit" type="primary" size="large" disabled={!this.allowTaskName(nameTask)} loading={loading}>
                                            {type === 'add' ? 'Thêm' : 'Cập nhật'}
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>

                        </div>

                    </Content>

                </Layout>
            </Layout>

        )
    }
}

const mapStateToProps = (state) => ({
    user: state.authentication.user,
    messageAlert: state.alert.type,
    recentTask: state.task.recentTask,
    allTasks: state.task.allTasks,
    allMembers: state.family.allMembers,
    allTaskCates: state.taskCate.allTaskCates,
    idCommonTaskCate: state.taskCate.idCommonTaskCate,
    loading: state.task.loading,
})
const actionCreators = {
    addTask: taskActions.addTask,
    editTask: taskActions.editTask,
}
export default connect(mapStateToProps, actionCreators)(FormCreateTask)