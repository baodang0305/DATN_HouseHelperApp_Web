import React from "react";
import {
    RedoOutlined,
    LeftOutlined,
    TeamOutlined,
    BellOutlined,
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
import { Layout, Row, Col, Button, Form, Input, Avatar, DatePicker, Select, Spin, Alert, Modal, Divider } from "antd";

import "./AddEvent.css";
import history from "../../../helpers/history";
import DashboardMenu from "../../DashboardMenu/DashboardMenu";
import { familyActions } from "../../../actions/family.actions";
import { calendarActions } from "../../../actions/calendar.actions";

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
            idScrollListMembers: 1,
            idScrollDateOfMonth: 1,
            currentUrlImg: "",
            repeatTypeOfMonth: 'day',
            repeatTypeOfYear: 'day',
            repeat: { type: "no-repeat", end: null, day: [], date: null, order: null, month: null },
            dateTime: { start: null, end: null },

            errorModalForm: "",
            activeTabNestedRepeatType: 'day',
            showRepeatModal: false,
        }
        this.scrollBarListMembers = React.createRef();
        this.scrollBarDateOfmonth = React.createRef();
        this.inputFile = React.createRef();
    }

    mapRepeatEventEditToRepeatForm = () => {
        let { repeat, repeatTypeOfMonth, repeatTypeOfYear, activeTabNestedRepeatType } = this.state;
        const { event } = history.location.state;

        if (event.repeat) {
            repeat.end = event.repeat.end;
            if (event.repeat.type === "day") {
                repeat.type = "day";
            }
            else if (event.repeat.type === "week") {
                repeat.type = "week";
                repeat.day = event.repeat.day ? event.repeat.day : [];
            }
            else if (event.repeat.type === "month") {
                repeat.type = "month";
                if (event.repeat.date) {
                    repeat.date = event.repeat.date;
                    repeatTypeOfMonth = "date"
                }
                else {
                    repeat.order = event.repeat.order;
                    repeat.day = [...event.repeat.day];
                    repeatTypeOfMonth = "day";
                    activeTabNestedRepeatType = "day";
                }
            }
            else if (event.repeat.type === "year") {
                repeat.type = "year";
                repeat.month = event.repeat.month;
                if (event.repeat.date) {
                    repeat.date = event.repeat.date;
                    repeatTypeOfYear = "date";
                    activeTabNestedRepeatType = "date";
                }
                else {
                    repeatTypeOfYear = "day";
                    repeat.order = event.repeat.order;
                    repeat.day = [...event.repeat.day];
                    activeTabNestedRepeatType = "day";
                }
            }
        }
        else {
            repeat.type = "no-repeat"
        }

        this.setState({
            repeat,
            repeatTypeOfMonth,
            repeatTypeOfYear,
            activeTabNestedRepeatType,
        });

    }

    componentDidMount() {
        const { getListMembers, type } = this.props;
        getListMembers();

        if (type === "edit") {
            let { assign } = this.state;
            const { event } = history.location.state;
            event.assign && event.assign.length > 0 && event.assign.forEach(element => assign = [...assign, element._id]);
            this.mapRepeatEventEditToRepeatForm();
            this.setState({
                assign,
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

    handleClickMemberPre = () => {
        const { idScrollListMembers } = this.state;
        if (idScrollListMembers > 1) {
            this.scrollBarListMembers.current.scrollLeft = this.scrollBarListMembers.current.scrollLeft - 160;
            this.setState({ idScrollListMembers: idScrollListMembers - 1 })
        }
    }

    handleClickMemberNext = () => {

        const { idScrollListMembers } = this.state;
        const { listMembers } = this.props;
        const numberOfMembers = listMembers ? listMembers.length : 0

        if (idScrollListMembers < numberOfMembers) {
            this.scrollBarListMembers.current.scrollLeft = this.scrollBarListMembers.current.scrollLeft + 160;
            this.setState({ idScrollListMembers: idScrollListMembers + 1 });
        }
    }

    handleClickDateOfMonthPre = () => {
        const { idScrollDateOfMonth } = this.state;
        if (idScrollDateOfMonth > 8) {
            this.scrollBarDateOfmonth.current.scrollLeft = this.scrollBarDateOfmonth.current.scrollLeft - 350;
            this.setState({ idScrollDateOfMonth: idScrollDateOfMonth - 8 })
        }
    }

    handleClickDateOfMonthNext = () => {
        const { idScrollDateOfMonth } = this.state;
        if (idScrollDateOfMonth < 24) {
            this.scrollBarDateOfmonth.current.scrollLeft = this.scrollBarDateOfmonth.current.scrollLeft + 350;
            this.setState({ idScrollDateOfMonth: idScrollDateOfMonth + 8 });
        }
    }

    handleSelectStartDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (dateString) { dateTime.start = new Date(dateString) }
        else { dateTime.start = null }
        this.setState({ dateTime });
    }

    handleSelectEndDate = (date, dateString) => {
        const { dateTime } = this.state;
        if (dateString) { dateTime.end = new Date(dateString) }
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

    handleSelectDaysOfWeek = (value) => {
        const { repeat } = this.state;
        const indexItem = (repeat && repeat.day && repeat.day.length > 0) ? repeat.day.findIndex(item => item === value) : -1;
        if (indexItem === -1) {
            repeat.type === "week"
                ? repeat.day = [...repeat.day, value]
                : repeat.day = [...value]
        }
        else {
            repeat.day.splice(indexItem, 1);
        }
        this.setState({ repeat });
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

        const { addEvent, editEvent, type } = this.props;
        const { name, assign, dateTime, reminder, image, notes, currentUrlImg, repeatTypeOfMonth, repeatTypeOfYear, repeat } = this.state;
        let newRepeat = repeat;

        if ((name && name.replace(/\s/g, '').length > 0) &&
            (assign.length !== 0) &&
            (dateTime.start !== null) &&
            (dateTime.end !== null)) {

            if (!newRepeat || newRepeat.type === "no-repeat") { newRepeat = null }
            else if (newRepeat.type === "day") { delete newRepeat.day }
            else if (newRepeat.type === "week") { delete newRepeat.date; delete newRepeat.order; }
            else if (newRepeat.type === "month") {
                delete newRepeat.month;
                if (repeatTypeOfMonth === "date") {
                    delete newRepeat.day;
                    delete newRepeat.order;
                } else {
                    delete newRepeat.date;
                }
            }
            else if (newRepeat.type === "year") {
                if (repeatTypeOfYear === "date") {
                    delete newRepeat.day;
                    delete newRepeat.order;
                } else {
                    delete newRepeat.date;
                }
            }

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

                        if (type === "add") {
                            addEvent({ name, assign, dateTime, reminder, repeat: newRepeat, photo, notes })
                        } else {
                            const { event } = history.location.state;
                            editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat: newRepeat, photo, notes });
                        }
                    });
                })
            }
            else {
                if (type === "edit") {
                    const { event } = history.location.state;
                    currentUrlImg ?
                        editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat: newRepeat, photo: currentUrlImg, notes })
                        :
                        editEvent({ "_id": event._id, name, assign, dateTime, reminder, repeat: newRepeat, notes })
                }
                else {
                    addEvent({ name, assign, dateTime, reminder, repeat: newRepeat, notes })
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

    renderOrderWeekOfMonth = () => {
        const { repeat } = this.state
        const children = [];
        for (let i = 0; i <= 5; i++) {
            children.push(
                <div key={i} className="avatar-custom-container"
                    onClick={() => {
                        repeat.order === i
                            ? repeat.order = null
                            : repeat.order = i
                        this.setState({ repeat })
                    }}
                >
                    <Avatar size={30}
                        style={{
                            fontSize: 12, opacity: repeat.order === i ? 0.5 : 1,
                            borderColor: repeat.order === i && '#1890ff',
                            borderStyle: repeat.order === i && 'groove',
                            borderWidth: repeat.order === i && 2,
                        }} >{i}</Avatar>
                    {repeat.order === i ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    convertDayOfWeek = (item) => {
        const result =
            item === 1 && "T2" ||
            item === 2 && "T3" ||
            item === 3 && "T4" ||
            item === 4 && "T5" ||
            item === 5 && "T6" ||
            item === 6 && "T7" ||
            item === 0 && "CN"
        return result;
    }

    checkSelectedDayOfWeek = (value) => {
        const { repeat } = this.state;
        return repeat && repeat.day && repeat.day.length > 0 ? repeat.day.findIndex(item => item === value) : -1;
    }

    renderDayOfWeek = () => {
        const children = [];
        for (let i = 0; i <= 6; i++) {
            children.push(
                <div className="avatar-custom-container" onClick={() => this.handleSelectDaysOfWeek(i)} key={i} >
                    <Avatar size={30}
                        style={{
                            fontSize: 12, opacity: this.checkSelectedDayOfWeek(i) !== -1 ? 0.5 : 1,
                            borderColor: this.checkSelectedDayOfWeek(i) !== -1 && '#1890ff',
                            borderStyle: this.checkSelectedDayOfWeek(i) !== -1 && 'groove',
                            borderWidth: this.checkSelectedDayOfWeek(i) !== -1 && 2,
                        }}
                    >{this.convertDayOfWeek(i)}</Avatar>
                    {this.checkSelectedDayOfWeek(i) !== -1 ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    renderDateOfMonth = () => {
        const { repeat } = this.state;
        const children = [];
        for (let i = 0; i <= 31; i++) {
            children.push(
                <div style={{ textAlign: "center" }} key={i}>
                    <div className="date-of-month-modal-item" >
                        <Avatar
                            size={30}
                            style={{
                                fontSize: 12, opacity: repeat.date === i ? 0.5 : 1,
                                borderColor: repeat.date === i && '#1890ff',
                                borderStyle: repeat.date === i && 'groove',
                                borderWidth: repeat.date === i && 2,
                            }}
                            onClick={() => { repeat.date = i; this.setState({ repeat }); }}
                        >{i}</Avatar>
                        {repeat.date === i
                            ? <CheckOutlined
                                className="check-selected-date-of-month"
                                onClick={() => { repeat.date = null; this.setState({ repeat }) }}
                            />
                            : null
                        }
                    </div>
                </div>
            )
        }
        return children;
    }

    renderMonthOfYear = () => {
        const { repeat } = this.state;
        const children = [];
        for (let i = 0; i <= 11; i++) {
            children.push(
                <div className="avatar-custom-container"
                    onClick={() => {
                        repeat.month === i
                            ? repeat.month = null
                            : repeat.month = i
                        this.setState({ repeat });
                    }} key={i} >
                    <Avatar size={30} key={i}
                        style={{
                            fontSize: 12, opacity: repeat.month === i ? 0.5 : 1,
                            borderColor: repeat.month === i && '#1890ff',
                            borderStyle: repeat.month === i && 'groove',
                            borderWidth: repeat.month === i && 2,
                        }}
                    >T{i + 1}</Avatar>
                    {repeat.month === i ? <CheckOutlined className="check-selected-day-of-week" /> : null}
                </div>
            )
        }
        return children;
    }

    handleRepeatCancelModal = () => {
        const { type } = this.props;
        const { repeat } = this.state;
        if (type === "add") {
            repeat.type = "no-repeat";
            this.setState({ repeat, showRepeatModal: false });
        }
        else {
            this.mapRepeatEventEditToRepeatForm();
            this.setState({ showRepeatModal: false });
        }
    }

    handleRepeatSaveModal = () => {
        const { repeat, repeatTypeOfMonth, repeatTypeOfYear } = this.state;
        let error = "";
        if (repeat.type === "week") {
            error = (!repeat.day || repeat.day.length <= 0) ? "Yêu cầu chọn: Thứ (lặp theo tuần thứ/tuần)" : ""
        }
        else if (repeat.type === "month") {
            repeatTypeOfMonth === "day"
                ?
                (
                    error = (!repeat.day || repeat.day.length <= 0) ? "Thứ" : "",
                    error = (repeat.order === null || repeat.order === undefined) ? (error ? (error + ", Tuần Thứ") : "Tuần Thứ") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo tháng thứ/tuần/tháng)") : ""
                )
                :
                (
                    error = (repeat.date === null | repeat.date === undefined) ? "Ngày" : "",
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo tháng ngày/tháng)") : ""
                )
        }
        else if (repeat.type === "year") {
            repeatTypeOfYear === "day"
                ? (
                    error = (!repeat.day || repeat.day.length <= 0) ? "Thứ" : "",
                    error = (repeat.order === null || repeat.order === undefined) ? (error ? (error + ", Tuần Thứ") : "Tuần Thứ") : error,
                    error = (repeat.month === null || repeat.month === undefined) ? (error ? (error + ", Tháng") : "Tháng") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo năm thứ/tuần/tháng/năm)") : ""
                )
                :
                (
                    error = (repeat.date === null || repeat.date === undefined) ? "Ngày" : "",
                    error = (repeat.month === null || repeat.month === undefined) ? (error ? (error + ", Tháng") : "Tháng") : error,
                    error = error ? ("Yêu cầu chọn: " + error + " (lặp theo năm ngày/tháng/năm)") : ""
                )
        }
        error ? this.setState({ errorModalForm: error }) : this.setState({ showRepeatModal: false, errorModalForm: "" });
    }

    render() {

        const { name, assign, dateTime, reminder, notes, error, currentUrlImg, repeat,
            repeatTypeOfMonth, repeatTypeOfYear, activeTabNestedRepeatType, showRepeatModal, errorModalForm
        } = this.state;

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
                            style={{ 
                                backgroundColor: item.mAvatar.color, 
                                opacity: isSelectedMember(item._id) !== -1 && 0.5, 
                                border: "groove thin",
                                borderColor: isSelectedMember(item._id) !== -1 && "#1890ff"
                            }}
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

        const checkDayTabActive = () => {
            if (
                repeat.type === "week"
                ||
                (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "day")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "day")
            ) return true;
            else return false;
        }

        const checkOrderTabActive = () => {
            if (
                (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "order")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "order")
            ) return true;
            else return false;
        }

        const checkMonthTabActive = () => {
            if (
                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "month")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "date" && activeTabNestedRepeatType === "month")
            ) return true;
            else return false;
        }

        const checkDateTabActive = () => {
            if (
                (repeat.type === "month" && repeatTypeOfMonth === "date")
                ||
                (repeat.type === "year" && repeatTypeOfYear === "date" && activeTabNestedRepeatType === 'date')
            ) return true;
            else return false;
        }

        const convertRepeatType = () => {
            const result =
                (repeat.type === "no-repeat" && "Không lặp")
                || (repeat.type === "day" && "Mõi ngày")
                || (repeat.type === "week" && "Tuần")
                || (repeat.type === "month" && "Tháng")
                || (repeat.type === "year" && "Năm")
            return result;
        }

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
                            <div className="right-header-calendar-container"></div>
                        </div>
                    </Header>
                    <Content style={{ position: 'relative' }}>
                        <Form onFinish={this.handleSubmit} size="large">

                            {error &&
                                (!name ||
                                    name.replace(/\s/g, '').length === 0 ||
                                    assign.length === 0 ||
                                    !dateTime.start ||
                                    !dateTime.end) &&

                                <Alert type="error" className="form-item-add-event alert-error-submit-form"
                                    message={`
                                                ${(!name || name.replace(/\s/g, '').length === 0) ? "Ten " : ""}
                                                ${assign.length === 0 ? "ThanhVien " : ""}
                                                ${!dateTime.start ? "ThoiGianBatDau " : ""}
                                                ${!dateTime.end ? "ThoiGianKetThuc " : ""}
                                                là bắt buộc.
                                            `}
                                />
                            }

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
                                    style={{ color: assign.length > 0 ? "#096dd9" : "black" }}
                                > Thành Viên: </span>
                                <Row align="middle" justify="center" style={{ marginBottom: 20 }}>
                                    {gettingListMembers && !gotListMembers ?
                                        <Spin tip="Loading..." />
                                        :
                                        <>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickMemberPre} className="pre-icon-add-event"> <LeftOutlined /> </div>
                                            }
                                            <div ref={this.scrollBarListMembers} className="list-users-asign-add-event-container" >
                                                {renderListMembers()}
                                            </div>
                                            {listMembers && listMembers.length > 5 &&
                                                <div onClick={this.handleClickMemberNext} className="next-icon-add-event"> <RightOutlined /> </div>
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
                                            style={{ color: dateTime.start && dateTime.end ? "#096dd9" : "black" }}
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
                                            style={{ color: "#096dd9" }}
                                        />
                                        <span style={{ color: "#096dd9" }}>Nhắc nhở</span>
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
                                    <Col span={16} className="col-form-item-add-event">
                                        <Button className="width-70-percent" onClick={() => this.setState({ showRepeatModal: true })} >{convertRepeatType()}</Button>
                                    </Col>

                                    <Modal width={450} closable={false} footer={null} title={null} visible={showRepeatModal} >
                                        <div className="body-modal">
                                            <div className="title-modal-container" >
                                                <p className="title-repeat-modal">Lặp Lại</p>
                                                {errorModalForm &&
                                                    <Alert type="error" className="form-item-add-event alert-error-submit-form" message={errorModalForm} />
                                                }
                                                <div className="repeat-type-modal-container">
                                                    <div
                                                        className={`repeat-type-item-modal ${repeat.type === "no-repeat" && "repeat-type-item-modal-selected"} `}
                                                        onClick={() => { repeat.type = "no-repeat"; this.setState({ repeat }); }}
                                                    >Không</div>
                                                    <div className={`repeat-type-item-modal ${repeat.type === "day" && "repeat-type-item-modal-selected"} `}
                                                        onClick={() => {
                                                            repeat.type = "day";
                                                            repeat.day = [];
                                                            repeat.order = null;
                                                            repeat.month = null;
                                                            repeat.date = null;
                                                            this.setState({ repeat });
                                                        }}
                                                    >Ngày</div>
                                                    <div className={`repeat-type-item-modal ${repeat.type === "week" && "repeat-type-item-modal-selected"} `}
                                                        onClick={() => {
                                                            repeat.type = "week";
                                                            repeat.day = [];
                                                            repeat.order = null;
                                                            repeat.month = null;
                                                            repeat.date = null;
                                                            this.setState({ repeat });
                                                        }}
                                                    >Tuần</div>
                                                    <div className={`repeat-type-item-modal ${repeat.type === "month" && "repeat-type-item-modal-selected"} `}
                                                        onClick={() => {
                                                            repeat.type = "month";
                                                            repeat.day = [];
                                                            repeat.order = null;
                                                            repeat.month = null;
                                                            repeat.date = null;
                                                            this.setState({ repeat });
                                                        }}
                                                    >Tháng</div>
                                                    <div className={`repeat-type-item-modal ${repeat.type === "year" && "repeat-type-item-modal-selected"} `}
                                                        onClick={() => {
                                                            repeat.type = "year";
                                                            repeat.day = [];
                                                            repeat.order = null;
                                                            repeat.month = null;
                                                            repeat.date = null;
                                                            this.setState({ repeat });
                                                        }}
                                                    >Năm</div>
                                                </div>
                                            </div>

                                            <Divider />

                                            {repeat.type === "no-repeat"
                                                ? null
                                                : <DatePicker
                                                    style={{ width: '80%' }}
                                                    value={repeat.end ? moment(repeat.end) : null}
                                                    onChange={this.handleSelectEndtDateRepeat}
                                                    placeholder="Ngày kết thúc"
                                                />
                                            }

                                            {(repeat.type === "month" || repeat.type === "year") &&
                                                <div style={{ width: "80%", display: 'flex', justifyContent: 'space-between', margin: '10px 0px' }}>
                                                    <Button
                                                        style={{ width: "48%" }}
                                                        type={
                                                            (
                                                                (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                                ||
                                                                (repeat.type === "year" && repeatTypeOfYear === "day")
                                                            ) ? "primary" : ""
                                                        }
                                                        ghost={
                                                            (
                                                                (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                                ||
                                                                (repeat.type === "year" && repeatTypeOfYear === "day")
                                                            ) ? true : false
                                                        }
                                                        onClick={() => {
                                                            repeat.type === "month"
                                                                ? this.setState({ repeatTypeOfMonth: "day" })
                                                                : this.setState({ repeatTypeOfYear: "day" })
                                                        }
                                                        }>Theo thứ</Button>
                                                    <Button
                                                        style={{ width: "48%" }}
                                                        type={
                                                            (
                                                                (repeat.type === "month" && repeatTypeOfMonth === "date")
                                                                ||
                                                                (repeat.type === "year" && repeatTypeOfYear === "date")
                                                            ) ? "primary" : ""
                                                        }
                                                        ghost={
                                                            (
                                                                (repeat.type === "month" && repeatTypeOfMonth === "date")
                                                                ||
                                                                (repeat.type === "year" && repeatTypeOfYear === "date")
                                                            ) ? true : false
                                                        }
                                                        onClick={() => {
                                                            repeat.type === "month"
                                                                ? this.setState({ repeatTypeOfMonth: "date" })
                                                                : this.setState({ repeatTypeOfYear: "date" })
                                                        }
                                                        }>Theo ngày</Button>
                                                </div>
                                            }

                                            < div className="nested-repeat-type-modal-container">
                                                {(
                                                    repeat.type === "week"
                                                    ||
                                                    (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                    ||
                                                    (repeat.type === "year" && repeatTypeOfYear === "day")
                                                ) && <div
                                                    className="nested-repeat-type-item-modal"
                                                    style={{
                                                        color: checkDayTabActive() && "#1890ff",
                                                        borderBottomColor: checkDayTabActive() && "#1890ff",
                                                        fontWeight: checkDayTabActive() && 'bold'
                                                    }}
                                                    onClick={() => this.setState({ activeTabNestedRepeatType: 'day' })}> Thứ </div>}
                                                {(
                                                    (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                    ||
                                                    (repeat.type === "year" && repeatTypeOfYear === "day")
                                                ) && <div
                                                    className="nested-repeat-type-item-modal"
                                                    style={{
                                                        color: checkOrderTabActive() && "#1890ff",
                                                        borderBottomColor: checkOrderTabActive() && "#1890ff",
                                                        fontWeight: checkOrderTabActive() && 'bold'
                                                    }}
                                                    onClick={() => this.setState({ activeTabNestedRepeatType: 'order' })}>Tuần Thứ</div>}
                                                {(
                                                    (repeat.type === "month" && repeatTypeOfMonth === "date")
                                                    ||
                                                    (repeat.type === "year" && repeatTypeOfYear === "date")
                                                ) && <div
                                                    className="nested-repeat-type-item-modal"
                                                    style={{
                                                        color: checkDateTabActive() && "#1890ff",
                                                        borderBottomColor: checkDateTabActive() && "#1890ff",
                                                        fontWeight: checkDateTabActive() && 'bold'
                                                    }}
                                                    onClick={() => this.setState({ activeTabNestedRepeatType: "date" })} >Ngày</div>
                                                }
                                                {(repeat.type === "year")
                                                    && <div
                                                        className="nested-repeat-type-item-modal"
                                                        style={{
                                                            color: checkMonthTabActive() && "#1890ff",
                                                            borderBottomColor: checkMonthTabActive() && "#1890ff",
                                                            fontWeight: checkMonthTabActive() && 'bold'
                                                        }}
                                                        onClick={() => this.setState({ activeTabNestedRepeatType: "month" })
                                                        }>Tháng</div>
                                                }
                                            </div>

                                            {
                                                (
                                                    (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                    ||
                                                    (repeat.type === "year" && repeatTypeOfYear === "day")
                                                )
                                                && activeTabNestedRepeatType === "order" &&
                                                <div className="order-week-of-month-modal-container">
                                                    {this.renderOrderWeekOfMonth()}
                                                </div>
                                            }

                                            {
                                                (repeat.type === "week" ||
                                                    (
                                                        (
                                                            (repeat.type === "month" && repeatTypeOfMonth === "day")
                                                            ||
                                                            (repeat.type === "year" && repeatTypeOfYear === "day")
                                                        ) && activeTabNestedRepeatType === "day")
                                                ) &&
                                                <div className="day-of-week-modal-container">
                                                    {this.renderDayOfWeek()}
                                                </div>
                                            }

                                            {
                                                (
                                                    (repeat.type === "month" && repeatTypeOfMonth === "date")
                                                    ||
                                                    (
                                                        repeat.type === "year"
                                                        && repeatTypeOfYear === "date"
                                                        && activeTabNestedRepeatType === "date"
                                                    )
                                                )
                                                && <div className="date-of-month-modal-container">
                                                    <LeftOutlined onClick={this.handleClickDateOfMonthPre} />
                                                    <div ref={this.scrollBarDateOfmonth} className="date-of-month-modal">
                                                        {this.renderDateOfMonth()}
                                                    </div>
                                                    <RightOutlined onClick={this.handleClickDateOfMonthNext} />
                                                </div>
                                            }

                                            {repeat.type === "year" && activeTabNestedRepeatType === "month" &&
                                                <div className="month-of-year-modal-container">
                                                    {this.renderMonthOfYear()}
                                                </div>
                                            }
                                            {(
                                                (repeat.type === "month" && repeatTypeOfMonth === "day" && activeTabNestedRepeatType === "order")
                                                ||
                                                (repeat.type === "year" && repeatTypeOfYear === "day" && activeTabNestedRepeatType === "order")
                                             )  &&  <div style={{margin: '20px 0px 0px 0px', color: '#1890ff'}}>Ghi chú: 0 là tuần cuối của tháng.</div>
                                            }
                                            {
                                                (
                                                    (repeat.type === "month" && repeatTypeOfMonth === "date" )
                                                    ||
                                                    (repeat.type === "year" &&  repeatTypeOfYear === "date" && activeTabNestedRepeatType === "date")
                                                ) && <div style={{margin: '20px 0px 0px 0px', color: '#1890ff'}}>Ghi chú: 0 là ngày cuối cùng của tháng</div>
                                            }
                                            <Divider />

                                            <div className="footer-modal">
                                                <Button onClick={this.handleRepeatCancelModal} className="cancel-button-modal" ghost type="primary">Đóng</Button>
                                                <Button onClick={this.handleRepeatSaveModal} className="save-button-modal" type="primary">Lưu Lại</Button>
                                            </div>

                                        </div>
                                    </Modal>

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
                                        style={{ margin: "5px 20px 0px 20px" }} autoSize={{ minRows: 2 }}
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

                        {((addingEvent && !addedEvent) || (edittingEvent && !editedEvent) || (deletingEvent && !deletedEvent)) && renderSpin()}

                    </Content>
                    <Footer style={{ textAlign: 'center', padding: "10px 0px", margin: "0px 20px" }}></Footer>
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