import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import socketIoClient from "socket.io-client";
import { PlusOutlined, HomeOutlined, LeftOutlined, RightOutlined, BellOutlined } from "@ant-design/icons";
import { Layout, Calendar, Button, Avatar, Input, Divider } from "antd";

import "./Calendar.css";
import history from "../../helpers/history";
import apiUrlTypes from "../../helpers/apiURL";
import { alertActions } from "../../actions/alert.actions";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { familyActions } from "../../actions/family.actions";
import { calendarActions } from "../../actions/calendar.actions";
import { indexConstants } from "../../constants/index.constants";
import HeaderMain from "../../components/Common/HeaderMain/HeaderMain"

let socket;
const { Search } = Input;
const { Header, Content, Footer } = Layout;

class CalendarPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: {
                d: null,
                m: null,
                y: null
            },
            idCurrentItem: 1,
            isSelectedMember: 'all'
        }
        this.scrollBar = React.createRef();
        this.reminderBellAudio = new Audio(indexConstants.REMINDER_BELL_AUDIO);
    }

    componentDidMount() {

        const { date } = this.state;
        const { getListMembers, getListEvents } = this.props;
        socket = socketIoClient(apiUrlTypes.heroku);

        const today = new Date();
        date.d = today.getDate();
        date.m = today.getMonth();
        date.y = today.getFullYear();
        this.setState({ date });

        getListMembers();
        getListEvents({ "month": today.getMonth(), "year": today.getFullYear() });

        socket.on("connect", () => {
            const inforLogin = JSON.parse(localStorage.getItem("inforLogin"));
            socket.emit("authenticate", { "token": inforLogin.token });
        });

        socket.on("Event", data => {
            if (data.type === "reminderEvent") {
                const { remindEventNotification, startRemindEventNotification } = this.props;
                remindEventNotification(data);
                startRemindEventNotification();
                this.reminderBellAudio.play();
                this.reminderBellAudio.loop = true;
            }
            if (data.type === "addEvent" || data.type === "editEvent" || data.type === "deleteEvent") {
                getListEvents({ "month": today.getMonth(), "year": today.getFullYear() });
            }
        });

    }

    componentWillUnmount() {
        socket && socket.connected && socket.close();
        this.reminderBellAudio.pause();
    }

    handleClickPre = () => {
        const { idCurrentItem } = this.state;
        if (idCurrentItem > 1) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft - 200;
            this.setState({ idCurrentItem: idCurrentItem - 1 })
        }
    }

    handleClickNext = () => {

        const { idCurrentItem } = this.state;
        const { listMembers } = this.props;
        const numberOfMembers = listMembers ? listMembers.length : 0;

        if (idCurrentItem < numberOfMembers) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft + 200;
            this.setState({ idCurrentItem: idCurrentItem + 1 });
        }
    }

    handleChooseMember = (mID) => {
        this.setState({ isSelectedMember: mID })
    }

    dateCellRender = (value) => {

        const { date } = this.state;
        const { listCalendar } = this.props;

        if (listCalendar) {
            const d = value._d.getDate();
            const m = value._d.getMonth();
            const y = value._d.getFullYear();
            const index = (y === date.y && m === date.m) ? listCalendar.findIndex(element => element.date === d) : -1;
            const listEvents = (index !== -1 && listCalendar[index].listEvents.length !== 0) && listCalendar[index].listEvents;
            return listEvents && listEvents.map((item, index) =>
                <div onClick={() => this.handleClickEvent(item)}
                    key={index} className="event-tag"
                    style={{ backgroundColor: `#010${index + 1}` }}
                >
                    {index + 1}. {item.name}
                </div>
            )
        }
    }

    handleClickEvent = (item) => {
        history.push({ pathname: "/calendar/edit-event", search: `?id=${item._id}`, state: { event: item } })
    }

    onPanelChange = (value, mode) => {
        const { date } = this.state;
        const { getListEvents } = this.props;
        const d = value._d.getDate();
        const m = value._d.getMonth();
        const y = value._d.getFullYear();
        if (y !== date.y) { date.y = y; getListEvents({ "month": date.m, "year": y }); this.setState({ date }); }
        if (m !== date.m) { date.m = m; getListEvents({ "month": m, "year": date.y }); this.setState({ date }); }
        if (d !== date.d) { date.d = d; this.setState({ date }); }
    }

    render() {

        const { isSelectedMember } = this.state;
        const { listMembers, remindingEventNotification, remindedEventNotification } = this.props;

        !remindingEventNotification && remindedEventNotification && this.reminderBellAudio.pause();

        const renderListMembers = () =>
            listMembers && listMembers.map((item, index) =>
                <div className="user-calendar-container" key={index}>
                    <div className="avatar-event-container" onClick={() => this.handleChooseMember(item._id)}>
                        {isSelectedMember === item._id ?
                            <Avatar className="calendar__avatar-member border-avatar-calendar" src={item.mAvatar.image} style={{ backgroundColor: item.mAvatar.color }} />
                            :
                            <Avatar className="calendar__avatar-member" src={item.mAvatar.image} style={{ backgroundColor: item.mAvatar.color }} />
                        }
                    </div>
                    {isSelectedMember === item._id ?
                        <div className="name-user-calendar" style={{ color: "#2985ff" }}>{item.mName}</div>
                        :
                        <div className="name-user-calendar">{item.mName}</div>
                    }
                </div>
            )

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="2" />
                <Layout className="site-layout">
                    <Header className="header-container calendar__header" >
                        <div className="left-header-calendar-container">
                            <Link to='/family' className="header__btn-link header__home-btn">
                                <HomeOutlined className="icon-header-calendar" />
                            </Link>

                            <Search
                                className="calendar__header-search"
                                placeholder="Nhập nội dung tìm kiếm"
                                onSearch={value => console.log(value)}
                                style={{ marginLeft: 10 }}
                                size="large"
                            />
                        </div>
                        <div className="center-header-calendar-container"> Quản Lý Lịch </div>
                        <div className="right-header-calendar-container" >
                            <div style={{ marginRight: 10 }} className="header__btn-link">
                                <BellOutlined className={!remindedEventNotification && remindingEventNotification ? "remind-event-bell" : ""} />
                            </div>
                            <Link to="/calendar/add-event" className="header__btn-link">
                                <PlusOutlined className="icon-header-calendar" />
                            </Link>
                        </div>
                        {/* <HeaderMain tab="calendar" title="Sự kiện"></HeaderMain> */}
                    </Header>

                    <Content >
                        <div className="first-row-content-calendar-container" >
                            <div>
                                {listMembers && listMembers.length > 4 &&
                                    <div className="pre-icon-calendar" onClick={this.handleClickPre} >
                                        <LeftOutlined style={{ color: 'gray' }} />
                                    </div>
                                }
                            </div>

                            <div className="list-user-calendar-container" ref={this.scrollBar}>
                                <div className="user-calendar-container" >
                                    <div className="avatar-event-container" onClick={() => this.handleChooseMember("all")}>
                                        {isSelectedMember === "all" ?
                                            < Avatar className="calendar__avatar-member border-avatar-calendar" icon={<HomeOutlined style={{ fontSize: "22px", color: "#2985ff" }} />} />
                                            :
                                            < Avatar className="calendar__avatar-member" icon={<HomeOutlined style={{ fontSize: "22px", color: "gray" }} />} />
                                        }
                                    </div>
                                    {isSelectedMember === "all" ?
                                        <div className="name-user-calendar" style={{ color: "#2985ff" }}>Tất cả</div>
                                        :
                                        <div className="name-user-calendar">Tất cả</div>
                                    }
                                </div>
                                {renderListMembers()}
                            </div>

                            <div>
                                {listMembers && listMembers.length > 4 &&
                                    <div className="next-icon-calendar" onClick={this.handleClickNext}>
                                        <RightOutlined style={{ color: 'gray' }} />
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="content-calendar">
                            <div className="calendar__show-event">
                                <Divider>Sự kiện trong ngày</Divider>
                                <div>Khi bấm 1 ngày thì danh sách event ngày đó show ở đây
                                </div>
                            </div>
                            <div className="calendar__calender-container">
                                <Calendar className="calendar__pc-or-tablet"
                                    dateCellRender={this.dateCellRender}
                                    onPanelChange={this.onPanelChange}
                                />

                                <Calendar fullscreen={false} className="calendar__mobile" />
                            </div>

                        </div>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout>
        )
    }
}

const mapStateToProps = (state) => ({
    listMembers: state.family.listMembers,
    listCalendar: state.calendar.listCalendar,
    remindingEventNotification: state.calendar.remindingEventNotification,
    remindedEventNotification: state.calendar.remindedEventNotification,
});

const actionCreators = {
    getListMembers: familyActions.getListMembers,
    getListEvents: calendarActions.getListEvents,
    remindEventNotification: alertActions.remindEventNotification,
    startRemindEventNotification: calendarActions.startRemindEventNotification
}

export default connect(mapStateToProps, actionCreators)(CalendarPage);
