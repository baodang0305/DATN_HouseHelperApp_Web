import {
    AlertOutlined,
    AppstoreOutlined, CheckOutlined,
    ClockCircleOutlined, LeftOutlined,
    MinusCircleOutlined, PlusOutlined,
    RetweetOutlined, ScheduleOutlined,
    SnippetsOutlined, StarOutlined, TeamOutlined,


    UploadOutlined
} from '@ant-design/icons';
import {
    Alert, Avatar, Button,
    Col, DatePicker,
    Divider, Form,
    Input,
    Layout, Row,
    Select, Switch
} from 'antd';
import firebase from 'firebase';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { familyActions } from '../../../actions/family.actions';
import { taskActions } from '../../../actions/task.actions';
import { taskCateActions } from '../../../actions/task.cate.actions';
import { indexConstants } from '../../../constants/index.constants';
import { storage } from '../../../helpers/firebaseConfig';
import history from '../../../helpers/history';
import BasicRepeatModal from "../../Common/RepeatModal/RepeatModalBasic";
import DashboardMenu from '../../DashboardMenu/DashboardMenu';
import './AddTask.css';






const { Option } = Select;
const { Header, Content } = Layout;
const { TextArea } = Input;

let index = 0;
const checkDataInput = data => {
    return data === '' || data.trim() === '' ? false : true;
};

function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
}

function translateDataRepeat(dataRepeat) {
    var textRepeat = null;
    if (dataRepeat) {
        switch (dataRepeat.type) {

            case 'daily': {
                textRepeat = 'Lặp: Ngày' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                break;
            }
            case 'weekly': {
                textRepeat = 'Lặp: Tuần' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                break;
            }
            case 'monthly': {
                textRepeat = 'Lặp: Tháng' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                break;
            }
            case 'yearly': {
                textRepeat = 'Lặp: Năm' + ' - ' + 'Bắt đầu: ' + moment(dataRepeat.start).format("YYYY-MM-DD HH:mm");
                break;
            }
            default: {
                textRepeat = 'Không lặp';
                break;
            }
        }
    }
    return textRepeat;
}
class FormCreateTask extends Component {
    constructor(props) {
        super(props);

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
            tcIDTask: null,
            notesTask: '',
            penaltyTask: 0,
            repeatTask: null,
            textRepeat: null,
            typeRepeatTask: null,
            startRepeatTask: null,
            keyTaskCate: [],
            currentUrlImg: indexConstants.UPLOAD_IMG,
            dataAddHowLong: '',
            dataAddPoint: '',
            dataAddRemindTime: '',
            onChangedData: false,
            enableRepeatModal: false,
            imageRecentToUpload: null,
            idTaskNeedEdit: null,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleChangeImg = e => {
        this.setState({
            currentUrlImg: URL.createObjectURL(e.target.files[0]),
            photoTask: URL.createObjectURL(e.target.files[0]),
            imageRecentToUpload: e.target.files[0],
        });
    };

    componentDidMount() {
        const { type } = this.props;
        const {
            getAllTaskCates,
            getListMembers,
            listMembers,
            allTaskCates
        } = this.props;
        getAllTaskCates();
        getListMembers();
        //clone data recent task after choosing edit action.

        if (type === 'edit') {
            const { taskNeedEdit } = history.location.state;
            this.setState({
                idTaskNeedEdit: taskNeedEdit._id,
                textRepeat: translateDataRepeat(taskNeedEdit.repeat),
                keyMember:
                    taskNeedEdit.assign !== null
                        ? taskNeedEdit.assign.mAssigns.map(item => item.mID._id)
                        : [],
                keyTaskCate: [taskNeedEdit.tcID._id],
                currentUrlImg: taskNeedEdit.photo,
                nameTask: taskNeedEdit.name,
                dueDateTask: taskNeedEdit.dueDate,
                penaltyTask: taskNeedEdit.penalty,
                repeatTask: taskNeedEdit.repeat,
                startRepeatTask: taskNeedEdit.repeat ? taskNeedEdit.repeat.start : null,
                typeRepeatTask: taskNeedEdit.repeat ? taskNeedEdit.repeat.type : null,
                timeTask: taskNeedEdit.time,
                pointsTask: taskNeedEdit.points,
                tcIDTask: taskNeedEdit.tcID._id,
                notesTask: taskNeedEdit.notes,
                remindTimeTask: taskNeedEdit.reminder,
                assignMemberTask:
                    taskNeedEdit.assign !== null
                        ? {
                            mAssigns: taskNeedEdit.assign.mAssigns.map(
                                item => item.mID._id
                            ),
                            isAll: taskNeedEdit.assign.isAll
                        }
                        : null
            })

        }
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            onChangedData: true
        });
    }

    handleClickBack = () => {
        history.push('/tasks');
    };

    onAddPointChange = event => {
        this.setState({
            dataAddPoint: event.target.value
        });
    };
    onAddHowLongChange = event => {
        this.setState({
            dataAddHowLong: event.target.value
        });
    };
    onAddRemindTimeChange = event => {
        this.setState({
            dataAddRemindTime: event.target.value
        });
    };

    handleOnChangeSelectTypeRepeat = value => {
        const { startRepeatTask } = this.state;
        this.setState({ typeRepeatTask: value }, () =>
            this.setState({
                repeatTask: { start: startRepeatTask || null, type: value || null }
            })
        );
    };

    handleOnChangePenalty = value => {
        this.setState({ penaltyTask: Number(value) || 0 });
    };

    handleOnChangeSelectHowLong = value => {
        this.setState({ timeTask: Number(value) });
    };

    handleOnChangeTimeRemind = value => {
        this.setState({ remindTimeTask: Number(value) });
    };
    handleOnChangeSelectPoint = value => {
        this.setState({ pointsTask: Number(value) });
    };

    onChangeSwitchTypeAssign = checked => {
        const { assignMemberTask } = this.state;
        this.setState({
            assignMemberTask: { mAssigns: assignMemberTask.mAssigns, isAll: checked }
        });
    };
    addItemHowLong = () => {


        const { itemsHowLong, dataAddHowLong } = this.state;

        let i = itemsHowLong.indexOf(Number(dataAddHowLong));

        i === -1
            ? this.setState({
                itemsHowLong: [...itemsHowLong, dataAddHowLong],
                dataAddHowLong: ''
            })
            : null;
    };

    addItemRemindTime = () => {

        const { itemsRemindTime, dataAddRemindTime } = this.state;
        let i = itemsRemindTime.indexOf(Number(dataAddRemindTime));

        i === -1
            ? this.setState({
                itemsRemindTime: [...itemsRemindTime, dataAddRemindTime],
                dataAddRemindTime: ''
            })
            : null;
    };

    addItemPoints = () => {

        const { itemsPoints, dataAddPoint } = this.state;
        const i = itemsPoints.indexOf(Number(dataAddPoint));

        i === -1
            ? this.setState({
                itemsPoints: [...itemsPoints, dataAddPoint || `New item ${index++}`],
                dataAddPoint: ''
            })
            : null;
    };

    handledChangeAvatar = indexItem => {
        const { keyMember } = this.state;
        const i = keyMember.indexOf(indexItem);
        if (i !== -1) {
            keyMember.splice(i, 1);
            this.setState({
                keyMember: keyMember,
                assignMemberTask: { mAssigns: keyMember, isAll: false }
            });
        } else {
            this.setState({
                keyMember: [...keyMember, indexItem],
                assignMemberTask: { mAssigns: [...keyMember, indexItem], isAll: false }
            });
        }
    };
    handledChangeCate = indexItem => {
        const { keyTaskCate } = this.state;
        const i = keyTaskCate.indexOf(indexItem);
        if (i === -1) {
            this.setState({ keyTaskCate: [indexItem], tcIDTask: indexItem });
        }
    };

    handleOnChangeDatePicker = (value, dateString) => {
        this.setState({ dueDateTask: new Date(dateString) });
    };

    handleOnChangeStartRepeatDate = (value, timeString) => {
        const { typeRepeatTask } = this.state;
        this.setState({ startRepeatTask: new Date(timeString) || null }, () =>
            this.setState({
                repeatTask: { start: new Date(timeString), type: typeRepeatTask }
            })
        );
    };

    clickToShowRepeatModal = () => {
        this.setState({ enableRepeatModal: true });
    }

    clickCancelRepeatModal = () => {
        this.setState({ enableRepeatModal: false });
    }

    receiveDataRepeat = (dataRepeat) => {
        var textRepeat = null;
        textRepeat = translateDataRepeat(dataRepeat);
        this.setState({ repeatTask: { type: dataRepeat.type, start: dataRepeat.start }, enableRepeatModal: false, textRepeat: textRepeat });

    }
    handleSubmit = () => {
        const {
            nameTask,
            assignMemberTask,
            dueDateTask,
            photoTask,
            timeTask,
            pointsTask,
            tcIDTask,
            notesTask,
            penaltyTask,
            repeatTask,
            remindTimeTask, enableRepeatModal,
            imageRecentToUpload,
            idTaskNeedEdit
        } = this.state;

        const { addTask, editTask, type } = this.props;

        if (imageRecentToUpload) {
            const uploadTask = storage
                .ref()
                .child(`images/${imageRecentToUpload.name}`)
                .put(imageRecentToUpload);
            uploadTask.on(
                'state_changed',
                function (snapshot) {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING:
                            console.log('Upload is running');
                            break;
                    }
                },
                function (error) {
                    console.log(error);
                },
                function () {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        const photoTaskTemp = downloadURL;

                        type === 'add'
                            ? addTask(
                                nameTask,
                                assignMemberTask,
                                dueDateTask,
                                photoTaskTemp,
                                timeTask,
                                pointsTask,
                                tcIDTask,
                                notesTask,
                                penaltyTask,
                                repeatTask,
                                remindTimeTask
                            )
                            : editTask(
                                idTaskNeedEdit,
                                nameTask,
                                timeTask,
                                pointsTask,
                                assignMemberTask,
                                photoTaskTemp,
                                tcIDTask,
                                notesTask,
                                dueDateTask,
                                penaltyTask,
                                repeatTask,
                                remindTimeTask
                            );
                    });
                }
            );
        } else {
            type === 'add'
                ? addTask(
                    nameTask,
                    assignMemberTask,
                    dueDateTask,
                    photoTask,
                    timeTask,
                    pointsTask,
                    tcIDTask,
                    notesTask,
                    penaltyTask,
                    repeatTask,
                    remindTimeTask
                )
                : editTask(
                    idTaskNeedEdit,
                    nameTask,
                    timeTask,
                    pointsTask,
                    assignMemberTask,
                    taskNeedEdit.photo,
                    tcIDTask,
                    notesTask,
                    dueDateTask,
                    penaltyTask,
                    repeatTask,
                    remindTimeTask
                );
        }
    };

    allowTaskName = taskName => {
        const { onChangedData } = this.state;

        const { allTasks } = this.props;
        const checkExist = allTasks
            .filter(item => item.state === 'todo' || item.state === 'upcoming')
            .map(item => item.name.trim().toLowerCase())
            .indexOf(taskName.trim().toLowerCase());
        if (onChangedData && (checkExist !== -1 || !taskName || taskName.trim() === '')
        ) {
            return false;
        } else if (!taskName) {
            return false;
        }
        return true;
    };
    render() {
        const {
            itemsRemindTime,
            itemsHowLong,
            itemsPoints,
            dataAddPoint,
            dataAddHowLong,
            dataAddRemindTime,
            keyMember,
            currentUrlImg,
            nameTask,
            assignMemberTask,
            penaltyTask,
            repeatTask,
            remindTimeTask,
            dueDateTask,
            photoTask,
            timeTask,
            pointsTask,
            tcIDTask,
            notesTask,
            keyTaskCate, enableRepeatModal, textRepeat, onChangedData
        } = this.state;

        const { type, listMembers, allTaskCates, loading } = this.props;


        let classNameForAssignMember = ['icon-avatar-member'];
        if (!this.state.hiddenCheckAssign) {
            classNameForAssignMember.push('avatar-checked-assign-member');
        }
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="3" />
                <Layout className="site-layout add-task__layout">
                    <Header
                        className="site-layout-background header-container"
                        style={{ padding: '0 10px' }}
                    >
                        <div className="add-task__header">
                            <div
                                className="header__btn-link"
                                onClick={this.handleClickBack}
                                size="large"
                            >
                                <LeftOutlined
                                    onClick={() => {
                                        this.handleClickBack;
                                    }}
                                />
                            </div>
                            <div className="add-task__header-title">
                                {type === 'add' ? 'Tạo công việc' : 'Sửa công việc'}
                            </div>
                        </div>
                    </Header>
                    <Content className="add-task__content">
                        <div
                            className="container-add-task"
                            style={{ minHeight: 360, backgroundColor: 'transparent' }}
                        >
                            <Form
                                onFinish={this.handleSubmit}
                                className="container-form-add-task"
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
                            >
                                {/* Set up name of task - title of task */}
                                <Form.Item className="form-item-add">
                                    <Input
                                        className="input-item-add-task"
                                        value={nameTask ? nameTask : null}
                                        name="nameTask"
                                        onChange={this.handleInputChange}
                                        size="large"
                                        placeholder="Tên công việc"
                                    />
                                </Form.Item>
                                {this.allowTaskName(nameTask) === false && onChangedData ? (
                                    <Alert style={{ marginBottom: 5 }}
                                        message="Tên công việc không đúng hoặc đã tồn tại"
                                        type="error"
                                        showIcon
                                        closable
                                    />
                                ) : null}
                                {/* Set up time and point*/}

                                <Form.Item
                                    style={{ padding: 0, margin: '0px 0' }}
                                    rules={[
                                        { required: true, message: 'Please input your username!' }
                                    ]}>
                                    <Row
                                        gutter={[10, 0]}
                                        style={{ backgroundColor: 'transparent' }}>
                                        <Col span={12}>
                                            <div className="custom-select-add-task">
                                                <div className="present-select-add-task">
                                                    <ClockCircleOutlined className="add-task__button-select-icon" />
                                                    <div className="show-data-select">
                                                        {timeTask !== 0
                                                            ? timeTask + ' phút'
                                                            : 'Thời gian?'}
                                                    </div>
                                                </div>
                                                <Select
                                                    className="select-item-add-task"
                                                    onChange={this.handleOnChangeSelectHowLong}
                                                    size="large"
                                                    dropdownRender={menu => (
                                                        <div>
                                                            {menu}
                                                            <Divider style={{ margin: '4px 0' }} />
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexWrap: 'nowrap',
                                                                    padding: 8
                                                                }}
                                                            >
                                                                <Input
                                                                    style={{ flex: 'auto' }}
                                                                    value={dataAddHowLong}
                                                                    type="number"
                                                                    size="middle"
                                                                    placeholder="Number for minutes"
                                                                    onChange={this.onAddHowLongChange}
                                                                />
                                                                <a
                                                                    className={
                                                                        checkDataInput(dataAddHowLong)
                                                                            ? null
                                                                            : 'disable-btn-add-task'
                                                                    }
                                                                    style={{
                                                                        flex: 'none',
                                                                        display: 'block',
                                                                        cursor: 'pointer',
                                                                        marginLeft: 5,
                                                                        padding: '3px'
                                                                    }}
                                                                    onClick={this.addItemHowLong}>
                                                                    <PlusOutlined />&nbsp;Thêm</a>
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
                                                    <StarOutlined className="add-task__button-select-icon" />
                                                    <div className="show-data-select">
                                                        {pointsTask !== 0
                                                            ? pointsTask + ' điểm'
                                                            : 'Điểm thưởng'}
                                                    </div>
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
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    flexWrap: 'nowrap',
                                                                    padding: 8
                                                                }}>
                                                                <Input
                                                                    style={{ flex: 'auto' }}
                                                                    size="middle"
                                                                    value={dataAddPoint}
                                                                    type="number"
                                                                    onChange={this.onAddPointChange}
                                                                    placeholder="Number for points" />
                                                                <a
                                                                    className={
                                                                        checkDataInput(dataAddPoint)
                                                                            ? null
                                                                            : 'disable-btn-add-task'
                                                                    }
                                                                    style={{
                                                                        flex: 'none',
                                                                        padding: '3px',
                                                                        display: 'block',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                    onClick={this.addItemPoints}>
                                                                    <PlusOutlined /> Thêm
                                                                </a>
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
                                <Form.Item
                                    className="form-item-add"
                                    label={
                                        <div
                                            className="add-task__label-form-item"
                                            style={{ color: keyTaskCate.length ? '#2295FF' : "#444444" }}>
                                            <AppstoreOutlined style={{ fontSize: 17 }} />
                                                    &nbsp;Loại công việc
                                            </div>}>
                                    <div className="list-task-cate">
                                        {allTaskCates
                                            ? allTaskCates.map(item => (
                                                <div
                                                    key={item._id || null}
                                                    className="task-cate-item">
                                                    <div
                                                        className="avatar-task-cate"
                                                        onClick={e => {
                                                            this.handledChangeCate(item._id);
                                                        }} >
                                                        <Avatar
                                                            src={item.image}
                                                            className={
                                                                keyTaskCate.indexOf(item._id) !== -1
                                                                    ? 'icon-avatar-task-cate-checked'
                                                                    : 'icon-avatar-task-cate'} />
                                                        <CheckOutlined
                                                            className="icon-check-assign-task-cate"
                                                            hidden={
                                                                keyTaskCate.indexOf(item._id) !== -1
                                                                    ? false
                                                                    : true} />
                                                    </div>
                                                    <div className="add-task__label-cate">
                                                        {item.name}
                                                    </div>
                                                </div>

                                            ))
                                            : null}

                                        <div className="task-cate-item">
                                            <div className="form-task__icon-add-more">
                                                <Avatar className='icon-avatar-task-cate' style={{ backgroundColor: 'white' }} />
                                                <PlusOutlined className="icon-check-assign-task-cate" style={{ color: '#444444' }} />
                                            </div>
                                            <div className="add-task__label-cate">
                                                <Link to="/add-task-category" className="add-task__label-cate">Thêm mới</Link>
                                            </div>
                                        </div>
                                    </div>
                                </Form.Item>

                                {/* Set up assigned member for task */}

                                <Form.Item
                                    className="form-item-add"
                                    name="assign-member"
                                    label={
                                        <div
                                            className="add-task__label-form-item"
                                            style={{ color: keyMember.length ? '#2295FF' : null, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <TeamOutlined style={{ fontSize: 17 }} />
                                                &nbsp;Thành viên phụ trách
                                                </div>
                                            {keyMember.length > 1 ? (
                                                <div>
                                                    Cùng thực hiện
                                                    <Switch style={{ marginLeft: 10 }}
                                                        onChange={this.onChangeSwitchTypeAssign}
                                                        checkedChildren="có"
                                                        unCheckedChildren="không"
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    }>
                                    <div className="list-avatar-member">
                                        {listMembers
                                            ? listMembers.map(item => (
                                                <div key={item._id}
                                                    className="container-avatar-member">
                                                    <div
                                                        className="avatar-member"
                                                        onClick={e => {
                                                            this.handledChangeAvatar(item._id);
                                                        }}
                                                    >
                                                        <Avatar
                                                            className={
                                                                keyMember.indexOf(item._id) === -1
                                                                    ? 'icon-avatar-member'
                                                                    : 'icon-avatar-member-checked'
                                                            }
                                                            src={item.mAvatar.image}
                                                        />
                                                        <CheckOutlined
                                                            className="icon-check-assign-member"
                                                            hidden={
                                                                keyMember.indexOf(item._id) !== -1
                                                                    ? false
                                                                    : true}
                                                        />
                                                    </div>
                                                    <div className="name-avatar-member">
                                                        {item.mName}
                                                    </div>
                                                </div>
                                            ))
                                            : null}
                                        <div className="container-avatar-member">
                                            <div className="form-task__icon-add-more">
                                                <Avatar className='icon-avatar-task-cate' style={{ backgroundColor: 'white' }} />
                                                <PlusOutlined className="icon-check-assign-task-cate" style={{ color: '#444444' }} />
                                            </div>
                                            <div className="name-avatar-member">
                                                <Link to="/family/add-member" className="name-avatar-member">Thêm mới</Link>
                                            </div>
                                        </div>
                                    </div>
                                </Form.Item>

                                {/* Set up time of task */}

                                <Form.Item className="form-item-add">
                                    <Row gutter={[30]}>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col xs={8} sm={8} md={8} lg={5} xl={10}>
                                                        <div className="present-select-date-add-task">
                                                            <div
                                                                className="add-task__label-form-item"
                                                                style={{ color: repeatTask ? '#2985ff' : "#444444" }}>
                                                                <RetweetOutlined style={{ fontSize: 17 }} />
                                                                 &nbsp;Lặp lại
                                                                </div>
                                                        </div>
                                                    </Col>
                                                    <Col
                                                        xs={16} sm={16} md={16} lg={19} xl={14}
                                                        className="add-task__col-select-inside"
                                                    >
                                                        <Button className="grocery-form__btn-repeat"
                                                            onClick={() => { this.clickToShowRepeatModal() }}>
                                                            {textRepeat ? textRepeat : 'Không lặp'}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form.Item>
                                <Form.Item className="form-item-add">
                                    <Row gutter={[30]}>
                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col xs={8} sm={8} md={8} lg={10} xl={10}>
                                                        <div className="present-select-date-add-task">
                                                            <div
                                                                className="add-task__label-form-item"
                                                                style={{ color: dueDateTask ? '#2985ff' : "#444444" }}                                                                >
                                                                <ScheduleOutlined style={{ fontSize: 17 }} />
                                                            &nbsp;{repeatTask ? 'Kết thúc lặp' : 'Hạn công việc'}
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={16} sm={16} md={16} lg={14} xl={14}>
                                                        <DatePicker
                                                            dropdownClassName="task-form__date-picker"
                                                            disabledDate={disabledDate}
                                                            onChange={this.handleOnChangeDatePicker}
                                                            allowClear={true}
                                                            value={dueDateTask ? moment(dueDateTask, 'YYYY-MM-DD HH:mm') : null}
                                                            size="large"
                                                            name="dueDateTask"
                                                            style={{ width: '100%' }}
                                                            placeholder="Hạn cuối của công việc"
                                                            showTime
                                                            format="YYYY-MM-DD HH:mm"
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                        {dueDateTask !== null ? (
                                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                                <div className="custom-select-date-add-task">
                                                    <Row style={{ width: '100%' }}>
                                                        <Col xs={8} sm={8} md={8} lg={10} xl={10}>
                                                            <div className="present-select-date-add-task">
                                                                <div
                                                                    className="add-task__label-form-item"
                                                                    style={{ color: remindTimeTask ? '#2985ff' : "#444444" }}>
                                                                    <AlertOutlined style={{ fontSize: 17 }} />
                                                                    &nbsp;Nhắc nhở
                                                                    </div>
                                                            </div>
                                                        </Col>
                                                        <Col xs={16} sm={16} md={16} lg={14} xl={14}>
                                                            <Select
                                                                onChange={this.handleOnChangeTimeRemind}
                                                                size="large"
                                                                placeholder="Chọn thời gian nhắc trước"
                                                                defaultValue={
                                                                    remindTimeTask !== null
                                                                        ? remindTimeTask + ' phút'
                                                                        : undefined
                                                                }
                                                                dropdownRender={menu => (
                                                                    <div>
                                                                        {menu}
                                                                        <Divider style={{ margin: '4px 0' }} />
                                                                        <div
                                                                            style={{
                                                                                display: 'flex',
                                                                                flexWrap: 'nowrap',
                                                                                padding: 8
                                                                            }}>
                                                                            <Input
                                                                                style={{ flex: 'auto' }}
                                                                                defaultValue={
                                                                                    dataAddRemindTime
                                                                                        ? dataAddRemindTime
                                                                                        : null
                                                                                }
                                                                                type="number"
                                                                                placeholder="Nhập thời gian nhắc nhở"
                                                                                size="middle"
                                                                                onChange={this.onAddRemindTimeChange}
                                                                            />
                                                                            <a
                                                                                className={
                                                                                    checkDataInput(dataAddRemindTime)
                                                                                        ? null
                                                                                        : 'disable-btn-add-task'
                                                                                }
                                                                                style={{
                                                                                    flex: 'none',
                                                                                    padding: '3px',
                                                                                    display: 'block',
                                                                                    cursor: 'pointer'
                                                                                }}
                                                                                onClick={this.addItemRemindTime} >
                                                                                <PlusOutlined
                                                                                    style={{ marginLeft: 10 }}
                                                                                />
                                                                                 Thêm
                                                                                    </a>
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
                                            </Col>
                                        ) : null}

                                        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                            <div className="custom-select-date-add-task">
                                                <Row style={{ width: '100%' }}>
                                                    <Col xs={8} sm={8} md={8} lg={10} xl={10}>
                                                        <div className="present-select-date-add-task">
                                                            <div
                                                                className="add-task__label-form-item"
                                                                style={{ color: penaltyTask ? '#2985ff' : "#444444" }}>
                                                                <MinusCircleOutlined style={{ fontSize: 17 }} />
                                                                &nbsp;Điểm phạt
                                                                </div>
                                                        </div>
                                                    </Col>
                                                    <Col xs={16} sm={16} md={16} lg={14} xl={14}>
                                                        <Select
                                                            size="large"
                                                            name="penaltyTask"
                                                            defaultValue={
                                                                type === 'edit'
                                                                    ? penaltyTask + ' %'
                                                                    : undefined
                                                            }
                                                            placeholder="Chọn số điểm trừ"
                                                            onChange={this.handleOnChangePenalty}
                                                            style={{ width: '100%' }}
                                                            allowClear
                                                        >
                                                            <Option key="0" value="0">
                                                                Không trừ điểm
                                                                </Option>
                                                            <Option key="10" value="10">
                                                                Trừ 10%
                                                             </Option>
                                                            <Option key="20" value="20">
                                                                Trừ 20%
                                                             </Option>
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
                                        {photoTask ?
                                            <div className="show-upload-img">
                                                <img src={photoTask} className="after-upload-img" />
                                            </div> : null}
                                        <div className="task-form__change-image-container">
                                            <div className="task-form__change-image">
                                                <input
                                                    onChange={this.handleChangeImg}
                                                    type="file"
                                                    className="input-add-task-img"
                                                />{!photoTask
                                                    ? <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <UploadOutlined style={{ fontSize: 20 }} />&ensp;
                                                        <div>Thêm hình ảnh</div>
                                                    </div>
                                                    : 'Thay đổi ảnh'}
                                            </div>
                                            {photoTask ?
                                                <div className="task-form__change-image">
                                                    Xóa ảnh
                                            </div> : null}
                                        </div>


                                    </div>
                                </Form.Item>

                                {/* Note or detail task */}
                                <Form.Item
                                    className="form-item-add"
                                    label={
                                        <div
                                            className="add-task__label-form-item"
                                            style={{ color: notesTask !== '' || null ? '#2295FF' : null }}>
                                            <SnippetsOutlined style={{ fontSize: 17 }} />
                                                 &nbsp;Ghi chú:
                                            </div>
                                    }>
                                    <TextArea
                                        name="notesTask"
                                        value={notesTask ? notesTask : null}
                                        onChange={this.handleInputChange}
                                        placeholder="Chi tiết công việc"
                                        cols={2}
                                    />
                                </Form.Item>

                                <Form.Item className="form-item-add">
                                    <div className="button-add-task-form">
                                        <Button
                                            type="default"
                                            size="large"
                                            style={{ marginRight: 10 }}>
                                            Hủy</Button>
                                        <Button
                                            htmlType="submit"
                                            type="primary"
                                            size="large"
                                            disabled={!this.allowTaskName(nameTask)}
                                            loading={loading}
                                        >
                                            {type === 'add' ? 'Thêm công việc' : 'Cập nhật'}
                                        </Button>
                                    </div>
                                </Form.Item>
                                <BasicRepeatModal tab="task" handleClickCancelModalForParent={this.clickCancelRepeatModal} enableRepeatModal={enableRepeatModal} receiveDataRepeat={this.receiveDataRepeat}></BasicRepeatModal>
                            </Form>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    user: state.authentication.user,
    messageAlert: state.alert.type,
    taskNeedEdit: state.task.taskNeedEdit,
    allTasks: state.task.allTasks,
    listMembers: state.family.listMembers,
    allTaskCates: state.taskCate.allTaskCates,
    idCommonTaskCate: state.taskCate.idCommonTaskCate,
    loading: state.task.loading
});
const actionCreators = {
    addTask: taskActions.addTask,
    editTask: taskActions.editTask,
    getAllTaskCates: taskCateActions.getAllTaskCates,
    getListMembers: familyActions.getListMembers
};
export default connect(mapStateToProps, actionCreators)(FormCreateTask);
