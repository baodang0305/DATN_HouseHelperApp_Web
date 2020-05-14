import React from "react";
import {
    RedoOutlined,
    LeftOutlined,
    TeamOutlined,
    BellOutlined,
    CloseOutlined,
    CheckOutlined,
    RightOutlined,
    UploadOutlined,
    PictureOutlined,
    LoadingOutlined,
    SnippetsOutlined,
    CalendarOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import moment from "moment";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { storage } from "../../../helpers/firebaseConfig";
import { Layout, Row, Col, Button, Form, Input, Avatar, DatePicker, Select, Spin, Alert } from "antd";

import "./AddEvent.css";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { calendarActions } from "../../../actions/calendar.actions";

const { Option } = Select;
const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

class AddEvent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            notes: "",
            assign: [],
            reminder: 0,
            image: null,
            error: false,
            idCurrentItem: 1,
            currentUrlImg: "",
            repeat: { type: "no-repeat", end: null, day: [] },
            dateTime: { start: null, end: null },
            itemsDayOfWeek: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]
        }
        this.scrollBar = React.createRef();
        this.inputFile = React.createRef();
    }

    componentDidMount() {
        const { getListMembers, type } = this.props;
        getListMembers();

        if (type === "edit") {
            let { itemsDayOfWeek, assign, repeat } = this.state;
            const { event } = history.location.state;

            event.repeat && event.repeat.type === "week" && event.repeat.day.length > 0 &&
                event.repeat.day.forEach(element => {
                    const convertElement =
                        element == "1" && "Thứ 2" ||
                        element == "2" && "Thứ 3" ||
                        element == "3" && "Thứ 4" ||
                        element == "4" && "Thứ 5" ||
                        element == "5" && "Thứ 6" ||
                        element == "6" && "Thứ 7" ||
                        element == "0" && "Chủ nhật"
                    const index = itemsDayOfWeek.findIndex(item => item === convertElement);
                    index !== -1 && itemsDayOfWeek.splice(index, 1);
                });

            event.assign && event.assign.length > 0 && event.assign.forEach(element => assign = [...assign, element._id]);

            if (event.repeat) {
                if (event.repeat.type === "day") {
                    repeat.type = "day";
                    repeat.end = event.repeat.end;
                }
                else if (event.repeat.type === "week") {
                    repeat.type = "week";
                    repeat.end = event.repeat.end;
                    repeat.day = event.repeat.day;
                }
            }
            else {
                repeat.type = "no-repeat"
            }

            this.setState({
                repeat,
                assign: assign,
                itemsDayOfWeek,
                name: event.name,
                notes: event.notes,
                reminder: event.reminder,
                dateTime: event.dateTime,
                currentUrlImg: event.photo
            });
        }
    }

    handleClickBack = () => {
        history.push("/calendar");
    }

    handleClickPre = () => {
        const { idCurrentItem } = this.state;
        if (idCurrentItem > 1) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft - 160;
            this.setState({ idCurrentItem: idCurrentItem - 1 })
        }
    }

    handleClickNext = () => {

        const { idCurrentItem } = this.state;
        const { listMembers } = this.props;
        const numberOfMembers = listMembers ? listMembers.length : 0

        if (idCurrentItem < numberOfMembers) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft + 160;
            this.setState({ idCurrentItem: idCurrentItem + 1 });
        }
    }

    handleSelectStartDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (date) { dateTime.start = date._d }
        else { dateTime.start = null }
        this.setState({ dateTime });
    }

    handleSelectEndDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (date) { dateTime.end = date._d }
        else { dateTime.end = null }
        this.setState({ dateTime });
    }

    handleSelectEndtDateRepeat = (date, dateString) => {
        const { repeat } = this.state;
        if (date) { repeat.end = date._d }
        else { repeat.end = null }
        this.setState({ repeat });
    }

    handleChangeInput = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleChangeImg = (e) => {
        this.setState({ currentUrlImg: URL.createObjectURL(e.target.files[0]), image: e.target.files[0] });
    }

    handleClickDeleteImg = () => {
        this.inputFile.current.value = "";
        this.setState({ currentUrlImg: "", image: null });
    }

    handleChangeRepeatType = (value) => {
        const { repeat } = this.state;
        repeat.type = value;
        this.setState({ repeat });
    }

    handleSelectDaysOfWeek = (value) => {
        const { repeat, itemsDayOfWeek } = this.state;
        const convertValue =
            value === "Thứ 2" && "1" ||
            value === "Thứ 3" && "2" ||
            value === "Thứ 4" && "3" ||
            value === "Thứ 5" && "4" ||
            value === "Thứ 6" && "5" ||
            value === "Thứ 7" && "6" ||
            value === "Chủ nhật" && "0"

        repeat.day = [...repeat.day, convertValue];
        const index = itemsDayOfWeek.findIndex(element => element === value);
        index !== -1 && itemsDayOfWeek.splice(index, 1);
        this.setState({ itemsDayOfWeek, repeat });
    }

    handleDeleteDayOfWeek = (item) => {
        const { repeat, itemsDayOfWeek } = this.state;
        const convertItem =
            item === "1" && "Thứ 2" ||
            item === "2" && "Thứ 3" ||
            item === "3" && "Thứ 4" ||
            item === "4" && "Thứ 5" ||
            item === "5" && "Thứ 6" ||
            item === "6" && "Thứ 7" ||
            item === "0" && "Chủ nhật"
        const index = repeat.day.findIndex(element => element === item)
        index !== -1 && repeat.day.splice(index, 1);
        this.setState({ repeat, itemsDayOfWeek: [...itemsDayOfWeek, convertItem] });
    }

    handleAssign = (mID) => {
        let { assign } = this.state;
        const indexMember = assign.findIndex(item => item === mID);
        indexMember !== -1 ?
            assign.splice(indexMember, 1)
            :
            assign = [...assign, mID];
        this.setState({ assign });
    }

    handleSubmit = async () => {

        let { repeat } = this.state;
        const { addEvent, editEvent, type } = this.props;
        const { name, assign, dateTime, reminder, image, notes, currentUrlImg } = this.state;

        if (!repeat || repeat.type === "no-repeat") { repeat = null }
        else if (repeat.type === "day") { delete repeat.day }

        if ((name && name.replace(/\s/g, '').length > 0) &&
            (assign.length !== 0) &&
            (dateTime.start !== null) &&
            (dateTime.end !== null)) {

            if (image) {
                const uploadTask = storage.ref().child(`images/${image.name}`).put(image);
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
                    console.log(error)
                    return null;
                }, function () {
                    uploadTask.snapshot.ref.getDownloadURL().then(function (photo) {
                        
                        if(type === "add"){
                            addEvent({ name, assign, dateTime, reminder, repeat, photo, notes })
                        } else {
                            const { event } = history.location.state;
                            editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat, photo, notes });
                        }
                    });
                })
            }
            else {
                if (type === "edit") {
                    const { event } = history.location.state;
                    currentUrlImg ?
                        editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat, photo: currentUrlImg, notes })
                        :
                        editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat, notes })
                }
                else {
                    addEvent({ name, assign, dateTime, reminder, repeat, notes })
                }
            }
            this.setState({ error: false })
        }
        else {
            this.setState({ error: true })
        }
    }

    handleDeleteEvent = () => {
        const { deleteEvent } = this.props;
        const { event } = history.location.state;
        deleteEvent({ "eID": event._id });
    }

    render() {

        const { name, assign, dateTime, reminder, notes, error, currentUrlImg, itemsDayOfWeek, repeat } = this.state;
        const {
            listMembers, gettingListMembers, gotListMembers, addingEvent, addedEvent, type, edittingEvent, editedEvent,
            deletingEvent, deletedEvent
        } = this.props;

        const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

        const isSelectedMember = (mID) => assign && assign.findIndex(item => item === mID);

        const renderListMembers = () =>
            listMembers && listMembers.map((item, index) =>
                <div className="user-add-event-container" key={index} onClick={() => this.handleAssign(item._id)}>
                    <div className="avatar-add-event-container">
                        <Avatar
                            size={50} src={item.mAvatar.image}
                            style={{ backgroundColor: item.mAvatar.color, opacity: isSelectedMember(item._id) !== -1 && 0.5, border: "groove thin" }}
                        />
                    </div>
                    {isSelectedMember(item._id) !== -1 && <CheckOutlined className="check-asign-add-event" />}
                    <div className="name-user-add-event">{item.mName}</div>
                </div>
            )

        const renderSpin = () => 
            <div className="icon-loading-add-event">
                <Spin style={{ color: 'white' }} size="large" indicator={antIcon} />
            </div>

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="2" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <div className="header-calendar-container">
                            <div className="left-header-calendar-container">
                                <Button onClick={this.handleClickBack} size="large" >
                                    <LeftOutlined />
                                </Button>
                            </div>
                            <div className="center-header-calendar-container"> {type === "add" ? "Thêm Sự Kiện" : "Cập Nhật Sự Kiện"} </div>
                            <div></div>
                        </div>
                    </Header>
                    <Content style={{ position: 'relative' }}>
                        <Form onFinish={this.handleSubmit} size="large">
                            <Form.Item className="form-item-add-event">
                                <Input
                                    name="name" value={name} onChange={this.handleChangeInput}
                                    className="name-event-input" placeholder="Tên sự kiện" type="text"
                                />
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <TeamOutlined
                                    className="icon-input-add-event"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black", marginTop: 20 }}
                                />
                                <span
                                    className="title-input-add-event"
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black"}}
                                > Thành Viên: </span>
                                <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
                                    {gettingListMembers && !gotListMembers ?
                                        <Spin tip="Loading..." />
                                        :
                                        <>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickPre} className="pre-icon-add-event"> <LeftOutlined /> </div>
                                            }
                                            <div ref={this.scrollBar} className="list-users-asign-add-event-container" >
                                                {renderListMembers()}
                                            </div>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickNext} className="next-icon-add-event"> <RightOutlined /> </div>
                                            }
                                        </>
                                    }
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <CalendarOutlined
                                            className="icon-input-add-event"
                                            style={{ color: dateTime.start && dateTime.end ? "#096dd9" : "black"}}
                                        />
                                        <span style={{ color: dateTime.start && dateTime.end ? "#096dd9" : "black" }}>Thời gian</span>
                                    </Col>

                                    <Col span={7} >
                                        <DatePicker
                                            value={dateTime.start ? moment(dateTime.start) : null}
                                            onChange={this.handleSelectStartDate}
                                            style={{ float: 'right' }} showTime placeholder="Bắt đầu" showTime
                                        />
                                    </Col>
                                    <Col span={2} className="col-form-item-add-event"> <ArrowRightOutlined /></Col>
                                    <Col span={7} >
                                        <DatePicker
                                            showTime onChange={this.handleSelectEndDate} placeholder="Kết thúc"
                                            value={dateTime.end ? moment(dateTime.end) : null}
                                        />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <BellOutlined
                                            className="icon-input-add-event"
                                            style={{color: "#096dd9"}}
                                        />
                                        <span style={{color: "#096dd9"}}>Nhắc nhở</span>
                                    </Col>
                                    <Col span={16} className="col-form-item-add-event">
                                        <Input
                                            name="reminder" value={reminder} onChange={this.handleChangeInput}
                                            className="width-70-percent" type="number" suffix="Phút"
                                        />
                                    </Col>
                                </Row>
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event">
                                        <RedoOutlined className="icon-input-add-event" style={{ color: "#096dd9" }} />
                                        <span style={{ color: "#096dd9" }}>Lặp lại</span>
                                    </Col>
                                    <Col span={16} className="col-form-item-add-event repeat-col-add-event" >
                                        <div className="input-repeat-type-container">
                                            <Select
                                                value={repeat ? repeat.type : "no-repeat"} onChange={this.handleChangeRepeatType}
                                                style={{
                                                    width:
                                                        repeat && repeat.type === "day" && "41%" ||
                                                        repeat && repeat.type === "week" && "30%"
                                                }}
                                            >
                                                <Option value="no-repeat">Không lặp</Option>
                                                <Option value="day">Hằng ngày</Option>
                                                <Option value="week">Tuần</Option>
                                                <Option value="month">Tháng</Option>
                                                <Option value="year">Năm</Option>

                                            </Select>

                                            {repeat && (repeat.type === "day" || repeat.type === "week") &&
                                                <>
                                                    <ArrowRightOutlined />
                                                    <DatePicker
                                                        value={repeat.end ? moment(repeat.end) : null}
                                                        onChange={this.handleSelectEndtDateRepeat}
                                                        style={{
                                                            width:
                                                                repeat.type === "day" && "41%" ||
                                                                repeat.type === "week" && "30%"
                                                        }} placeholder="Ngày kết thúc"
                                                    />
                                                    {repeat.type === "week" &&
                                                        <>
                                                            <ArrowRightOutlined />
                                                            <Select
                                                                style={{ width: "30%" }}
                                                                placeholder="Thứ trong tuần"
                                                                onChange={this.handleSelectDaysOfWeek}
                                                            >
                                                                {itemsDayOfWeek.map((item, index) => <Option value={item} key={index}>{item}</Option>)}
                                                            </Select>
                                                        </>
                                                    }
                                                </>
                                            }
                                        </div>

                                        {repeat && repeat.type === "week" && repeat.day.length > 0 &&
                                            <Row className="tags-day-of-week-container">
                                                {repeat.day.map((item, index) =>
                                                    <div className="tag-add-event" key={index}>
                                                        <span className="title-tag-add-event">
                                                            {
                                                                item == "1" && "Thứ 2" ||
                                                                item == "2" && "Thứ 3" ||
                                                                item == "3" && "Thứ 4" ||
                                                                item == "4" && "Thứ 5" ||
                                                                item == "5" && "Thứ 6" ||
                                                                item == "6" && "Thứ 7" ||
                                                                item == "0" && "Chủ nhật"
                                                            }
                                                        </span>
                                                        <CloseOutlined className="close-icon-tag-add-event" onClick={() => this.handleDeleteDayOfWeek(item)} />
                                                    </div>
                                                )}

                                            </Row>
                                        }
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <Col span={4} className="title-input-add-event" >
                                        <PictureOutlined
                                            className="icon-input-add-event"
                                            style={{ color: currentUrlImg !== "" ? "#096dd9" : "black" }}
                                        />
                                        <span style={{ color: currentUrlImg !== "" ? "#096dd9" : "black" }}> Hình ảnh </span>
                                    </Col>
                                    <Col span={16} className="col-form-item-add-event" >
                                        {currentUrlImg !== "" && <img src={currentUrlImg} style={{ width: 300, height: 'auto' }} />}
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div className="upload-img-add-calendar-container" style={{ marginTop: currentUrlImg ? 5 : 0 }}>
                                                <div className="upload-img-ui-add-canlendar" >
                                                    <UploadOutlined style={{ fontSize: 16 }} />
                                                    &emsp;
                                                    <span style={{ fontSize: 16 }}> {!currentUrlImg ? "Chọn ảnh" : "Thay đổi ảnh"} </span>
                                                </div>
                                                <input ref={this.inputFile} className="input-file-add-calendar" type="file" onChange={this.handleChangeImg} />
                                            </div>
                                            {currentUrlImg && <div className="delete-img-button" onClick={this.handleClickDeleteImg}>Xóa ảnh</div>}
                                        </div>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event">
                                    <div className="title-input-add-event">
                                        <SnippetsOutlined
                                            className="icon-input-add-event"
                                            style={{ color: notes ? "#096dd9" : "black" }}
                                        />
                                        <span style={{ color: notes ? "#096dd9" : "black" }}>Ghi chú</span>
                                    </div>
                                    <TextArea
                                        name="notes" value={notes} onChange={this.handleChangeInput}
                                        style={{ margin: "5px 20px 0px 20px"}} autoSize={{ minRows: 2 }}
                                    />
                                </Row>
                            </Form.Item>
                            <Form.Item className="form-item-add-event">
                                <Row className="row-form-item-add-event" style={{ float: "right", marginRight: 20 }}>
                                    {type === "add" ?
                                        <Button type="primary" ghost size="large"> Hủy </Button>
                                        :
                                        <Button onClick={this.handleDeleteEvent} type="primary" ghost size="large"> Xóa </Button>
                                    }
                                &emsp;
                                <Button htmlType="submit" type="primary" size="large"> {type === "add" ? "Thêm" : "Cập nhật"} </Button>
                                </Row>
                            </Form.Item>
                        </Form>

                        {addingEvent && !addedEvent && renderSpin() }
                        {edittingEvent && !editedEvent && renderSpin() }
                        {deletingEvent && !deletedEvent && renderSpin() }
                        
                    </Content>
                    <Footer style={{ textAlign: 'center', padding: "10px 0px", margin: "0px 20px" }}>
                        { error && 
                        (!name || 
                        name.replace(/\s/g, '').length === 0 ||
                        assign.length === 0 || 
                        !dateTime.start ||
                        !dateTime.end) &&

                            <Alert type="error" style={{ backgroundColor: "#ee7674", marginBottom: 10 }} message=
                                {`
                                    ${(!name || name.replace(/\s/g, '').length === 0) ? "Ten " : ""}
                                    ${assign.length === 0 ? "ThanhVien " : ""}
                                    ${!dateTime.start ? "ThoiGianBatDau " : ""}
                                    ${!dateTime.end ? "ThoiGianKetThuc " : ""}
                                    là bắt buộc.
                                `}
                            />
                        }
                    </Footer>
                </Layout>
            </Layout >

        )
    }
}

const mapStateToProps = (state) => ({
    listMembers: state.family.listMembers,
    gotListMembers: state.family.gotListMembers,
    gettingListMembers: state.family.gettingListMembers,
    addedEvent: state.calendar.addedEvent,
    addingEvent: state.calendar.addingEvent,
    edittingEvent: state.calendar.edittingEvent,
    editedEvent: state.calendar.editedEvent,
    deletingEvent: state.calendar.deletingEvent,
    deletedEvent: state.calendar.deletedEvent,
});

const actionCreators = {
    addEvent: calendarActions.addEvent,
    editEvent: calendarActions.editEvent,
    deleteEvent: calendarActions.deleteEvent,
    getListMembers: familyActions.getListMembers,
}

export default connect(mapStateToProps, actionCreators)(AddEvent);