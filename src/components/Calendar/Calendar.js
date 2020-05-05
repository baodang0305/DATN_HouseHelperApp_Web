import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined, HomeFilled, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Layout, Calendar, Row, Col, Button, Avatar } from "antd";

import "./Calendar.css";
import DashboardMenu from "../DashboardMenu/DashboardMenu";

const { Header, Content, Footer } = Layout;

class CalendarPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numberOfUsers: 0,
            idCurrentItem: 1
        }
        this.scrollBar = React.createRef();
    }

    componentDidMount() {
        // fetch member from data

        this.setState({ numberOfUsers: 7 });
    }

    handleClickPre = () => {
        const { idCurrentItem } = this.state;
        if (idCurrentItem > 1) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft - 260;
            this.setState({ idCurrentItem: idCurrentItem - 1 })
        }
    }

    handleClickNext = () => {
        const { idCurrentItem, numberOfUsers } = this.state;
        if (idCurrentItem < numberOfUsers) {
            this.scrollBar.current.scrollLeft = this.scrollBar.current.scrollLeft + 260;
            this.setState({ idCurrentItem: idCurrentItem + 1 });
        }
    }

    render() {

        const { numberOfUsers } = this.state;

        return (
            <Layout style={{ minHeight: '100vh' }}>
                <DashboardMenu menuItem="2" />
                <Layout className="site-layout">
                    <Header className="header-container" >
                        <div className="header-calendar-container">
                            <div> </div>
                            <div className="center-header-calendar-container"> Lịch </div>
                            <Button size="large">
                                <Link to="/calendar/add-event"> <PlusOutlined className="icon-header-calendar" /> </Link>
                            </Button>
                        </div>
                    </Header>

                    <Content >
                        <div className="first-row-content-calendar-container" >
                            <div>
                                {numberOfUsers > 5 &&
                                    <div className="pre-icon-calendar" onClick={this.handleClickPre} > <LeftOutlined /> </div>
                                }
                            </div>

                            <div className="list-user-calendar-container" ref={this.scrollBar}>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        < Avatar size={50} icon={<HomeFilled style={{ fontSize: "22px" }} />} />
                                    </div>
                                    <div className="name-user-calendar">Tất cả</div>
                                </div>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A1</div>
                                </div>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A2</div>
                                </div>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A3</div>
                                </div>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A4</div>
                                </div>

                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A5</div>
                                </div>
                                <div className="user-calendar-container">
                                    <div className="avatar-event-container" >
                                        <Avatar size={50} />
                                    </div>
                                    <div className="name-user-calendar">Nguyễn Văn A6</div>
                                </div>
                            </div>

                            <div>
                                {numberOfUsers > 5 &&
                                    <div className="next-icon-calendar" onClick={this.handleClickNext} className="next-icon-calendar"> <RightOutlined /> </div>
                                }
                            </div>
                        </div>

                        <div className="site-layout-background" style={{ margin: " 0px 20px 30px 20px" }}>
                            <div style={{ padding: "40px 40px" }}>
                                <Calendar />
                            </div>
                        </div>

                    </Content>
                    <Footer style={{ textAlign: 'center' }}></Footer>
                </Layout>
            </Layout>
        )
    }
}

export default CalendarPage;
