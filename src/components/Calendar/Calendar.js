import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined, HomeFilled  } from "@ant-design/icons";
import { Layout, Calendar, Row, Col, Button } from "antd";

import "./Calendar.css";
import DashboardMenu from "../DashboardMenu/DashboardMenu";
import { indexConstants } from "../../constants/index.constants";

const { Header, Content, Footer } = Layout;

const CalendarPage = () => {

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <DashboardMenu menuItem="2" />
            <Layout className="site-layout">
                <Header className="site-layout-background" >
                    <Row style={{ width: '100%' }}>
                        <Col span={10} className="header-part-left" >

                        </Col>
                        <Col span={4} className="header-title">Calendar</Col>
                        <Col span={10} className="header-part-right">
                            <Button style={{ marginRight: 10 }} size="large">
                                <Link to="/calendar/add-event"> <PlusOutlined className="size-icon" /> </Link>
                            </Button>
                        </Col>
                    </Row>
                </Header>

                <Content >
                    <div className="list-user-calendar-container" >
                        <div className="user-calendar-container">
                            <div className="img-all-calendar" > 
                                <HomeFilled  style={{ fontSize: "22px" }}/> 
                            </div>
                            <div className="name-user-calendar">All</div>
                        </div>
                        <div className="user-calendar-container" >
                            <img className="img-user-calendar" src={indexConstants.MEMBER_IMG_DEFAULT} />
                            <div className="name-user-calendar">name</div>
                        </div>
                        <div className="user-calendar-container" >
                            <img className="img-user-calendar" src={indexConstants.MEMBER_IMG_DEFAULT} />
                            <div className="name-user-calendar">name</div>
                        </div>
                    </div>

                    <div className="site-layout-background" style={{  margin: " 0px 30px 30px 30px" }}>
                        <div style={{ padding: "20px 40px" }}>
                            <Calendar />
                        </div>
                    </div>

                </Content>
                <Footer style={{ textAlign: 'center' }}></Footer>
            </Layout>
        </Layout>
    )
}

export default CalendarPage;