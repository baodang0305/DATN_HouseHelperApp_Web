import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import socketIoClient from "socket.io-client";
import { PlusOutlined, HomeOutlined, BellOutlined, SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { Layout, Calendar, Button, Avatar, Input, Divider, Tooltip, Popover } from "antd";

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
            date: { d: null, m: null, y: null },
            isSelectedMember: 'all',
            enableInputSearch: false,
            visiblePopover: false
        }
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
    onSearch = (value) => {

        if (value) {
            var dataFilter = tabData.filter(item => nonAccentVietnamese(item.name).indexOf(nonAccentVietnamese(value)) !== -1);
            this.setState({ dataFilter });
        }
    }

    hidePopover = () => {
        this.setState({
            visiblePopover: false,
        });
    };

    handleVisibleChangePopover = visiblePopover => {
        this.setState({ visiblePopover });
    };
    render() {

        const { isSelectedMember, enableInputSearch, visiblePopover } = this.state;
        const { listMembers, remindingEventNotification, remindedEventNotification } = this.props;

        !remindingEventNotification && remindedEventNotification && this.reminderBellAudio.pause();

        const renderListMembers = () => (
            listMembers && listMembers.map((item, index) => (
                <div className="user-calendar-container" key={index}>
                    <div onClick={() => this.handleChooseMember(item._id)}>
                        <Avatar
                            src={item.mAvatar.image} style={{ backgroundColor: item.mAvatar.color }}
                            className={`calendar__avatar-member ${isSelectedMember === item._id ? "border-avatar-calendar" : ""}`}
                        />
                    </div>
                    <div className="name-user-calendar" style={{ color: isSelectedMember === item._id ? "#2985ff" : null }}>{item.mName}</div>
                </div>
            ))
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
                                size="small"
                                className="header-search__tablet-pc"
                                prefix={
                                    <Tooltip placement="bottom" title="Đóng tìm kiếm">
                                        <ArrowLeftOutlined onClick={() => this.setState({ enableInputSearch: !enableInputSearch })} />
                                    </Tooltip>}
                                allowClear
                                placeholder="Nhập từ khóa"
                                onSearch={this.onSearch}
                                style={{
                                    height: 32,
                                    marginLeft: 10,
                                    maxWidth: 200,
                                    overflowX: 'hidden',
                                    display: enableInputSearch ? 'flex' : 'none'
                                }}
                            />

                            <div className="header__btn-link header-search__tablet-pc" style={{ display: enableInputSearch ? 'none' : null }}
                                onClick={() => { this.setState({ enableInputSearch: !enableInputSearch }) }}>
                                <SearchOutlined className="task__header-icon" />
                            </div>

                            <Popover className="header-search__mobile header__btn-link"
                                content={
                                    <Search
                                        allowClear
                                        prefix={
                                            <ArrowLeftOutlined onClick={this.hidePopover} />}
                                        placeholder="Nhập từ khóa"
                                        onSearch={this.onSearch}
                                        style={{
                                            maxWidth: 200,
                                            overflowX: 'hidden',
                                        }}
                                    />}
                                trigger="click"
                                visible={this.state.visiblePopover}
                                onVisibleChange={this.handleVisibleChangePopover}
                            >
                                <div className="header__btn-link header-search__tablet-pc" style={{ display: enableInputSearch ? 'none' : null }}
                                >
                                    <SearchOutlined className="task__header-icon" />
                                </div>
                            </Popover>
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
                            <div className="list-user-calendar-container" >
                                <div className="user-calendar-container" >
                                    <div onClick={() => this.handleChooseMember("all")}>
                                        < Avatar
                                            icon={<HomeOutlined style={{ fontSize: "22px", color: isSelectedMember === "all" ? "#2985ff" : "gray" }} />}
                                            className={`calendar__avatar-member ${isSelectedMember === "all" ? "border-avatar-calendar" : ""}`}
                                        />
                                    </div>
                                    <div className="name-user-calendar" style={{ color: isSelectedMember === "all" ? "#2985ff" : null }}>Tất cả</div>
                                </div>
                                {renderListMembers()}
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
